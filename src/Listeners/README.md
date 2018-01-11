# Listeners

Add listeners to this directory and make sure they extend `AbstractListener` class. Framework will auto-register those.

Add event names to `AbstractListener.LISTEN_ON` array in order to trigger `handle()` method of the listener when they 
happen. 

If payload is sent to listener it will be available as first parameter of the `handle` method in format of 
`handle(payload)`.