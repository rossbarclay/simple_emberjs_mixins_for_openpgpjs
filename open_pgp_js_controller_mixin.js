'use strict';
/*
 */
var OpenPgpJsControllerMixin = Ember.Mixin.create( {

  actions: {
    lock: function( ) {
      this.set( 'passphrase', null );
    }
  },
  checkPassphrase: function( ) {

    this.set( 'locked', true );

    if ( Ember.isNone( this.get( 'passphrase' ) ) || this.get( 'isInvalid' ) ) {
      return false;
    }

    var privateKeyAsKeyObject = openpgp.key.readArmored( this.get( 'privateKey' ) ).keys[ 0 ],
      publicKeyAsKeyObject = this.get( 'publicKeyAsKeyObject' ),
      testString = Math.random( ).toString( 36 ).substr( 2, 5 );

    var message = openpgp.encryptMessage( [ publicKeyAsKeyObject ], testString );
    var messageAsMessageObject = openpgp.message.readArmored( message );

    privateKeyAsKeyObject.decrypt( this.get( 'passphrase' ) );

    try {
      openpgp.decryptMessage( privateKeyAsKeyObject, messageAsMessageObject );
      this.set( 'locked', false );
    }
    catch ( error ) {
      // key is already locked so doing nothing here is ok
    }
  }.observes( 'passphrase' ),
  lockStatement: function( ) {
    if ( this.get( 'locked' ) ) {
      return 'Locked';
    }
    else {
      return 'Unlocked';
    }
  }.property( 'locked' ),
  passphraseStrength: function( ) {
    return scorePassphrase( this.get( 'passphrase' ) );
  }.property( 'passphrase' )
} );


export
default OpenPgpJsControllerMixin;