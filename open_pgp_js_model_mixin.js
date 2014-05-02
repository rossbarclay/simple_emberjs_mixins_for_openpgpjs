'use strict';
/*

 A simple mixin to give Ember controllers the ability to manipulate cryptographic
 objects created via OpenPGPJS.

 For more information please see

    http://openpgpjs.org/

 This mixin assumes that the following fields are present in the model:

    privateKey: DS.attr( 'string' ),
    publicKey: DS.attr( 'string' ),
    passphrase: null,
    locked: true

A key pair can be generated like this (this simply OpenPGPJS):

 var bits = 4096;
 var name = "Test User <testuser@testing.com>";
 var pass = "passphrase1234";

 var myObject = this.store.createRecord( 'identity' );
 var keyPair = openpgp.generateKeyPair( openpgp.enums.publicKey.rsa_encrypt_sign, bits, name, passphrase );

  myObject.setProperties( {
    publicKey: keyPair.publicKeyArmored,
    privateKey: keyPair.privateKeyArmored
  } );

Encrypt + Sign:

  var cipherTextArmored = openpgp.signAndEncryptMessage( [ recipientPublicKeyAsObject ], sendersPrivateKeyAsObject, clearText );

Decryption:

  var messageObject = openpgp.message.readArmored( cipherTextArmored );
  var decryptedObject = openpgp.decryptAndVerifyMessage( recipientPrivateKeyAsKeyObject, [ senderPublicKeyAsKeyObject ], messageObject );
  var clearText = decryptedObject.text;
  var signatureIsValid = decryptedObject.signatures[ 0 ].valid;

 */
var OpenPgpJsModelMixin = Ember.Mixin.create( {

  passphrase: null,
  locked: true,

  privateKeyAsKeyObject: function( ) {
    return openpgp.key.readArmored( this.get( 'privateKey' ) ).keys[ 0 ];
  }.property( 'privateKey' ),
  publicKeyAsKeyObject: function( ) {
    return openpgp.key.readArmored( this.get( 'publicKey' ) ).keys[ 0 ];
  }.property( 'publicKey' ),
  fingerprint: function( ) {
    if ( this.get( 'isValid' ) ) {
      return this.get( 'publicKeyAsKeyObject' ).getKeyPacket( ).getFingerprint( );
    }
  }.property( 'publicKey' ),
  keyId: function( ) {
    if ( this.get( 'isValid' ) ) {
      return this.get( 'publicKeyAsKeyObject' ).getKeyPacket( ).getKeyId( ).toHex( );
    }
  }.property( 'publicKey' ),
  bits: function( ) {
    if ( this.get( 'isValid' ) ) {
      return 'bits';
      ////this.get( 'publicKeyAsKeyObject' ).getKeyPacket( ).byteLength( ) * 8;
    }
  }.property( 'publicKey' ),
  isValid: function( ) {
    return !( Ember.isNone( this.get( 'publicKey' ) ) );
  }.property( 'privateKey', 'publicKey' ),
  isInvalid: function( ) {
    return !this.get( 'isValid' );
  }.property( 'isValid' )
} );


export
default OpenPgpJsModelMixin;