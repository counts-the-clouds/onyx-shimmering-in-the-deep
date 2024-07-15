global.EventManager = (function() {

  // TODO: Send the event to the browser. Trigger the onComplete() function
  //       when finished if needed. I'm not sure if we need to do anything to
  //       remember the events between the time that they go to the server and
  //       we get a notification that the event has been completed. We may not
  //       even need to know that an event has been completed if there's
  //       nothing to do afterwards.
  //
  //       I know the first event will add tiles to the tile bag. I think we
  //       want to show an animation of that, so it should happen after the
  //       event completes. That could all happen client side though if the
  //       event handles the animation as the last step.
  //
  // TODO: Eventually we'll probably need something like the Weavers to do
  //       templete replacement within the events. For now we'll just send the
  //       raw event.
  //
  function triggerEvent(code) {
    let event = new TileEvent(code);

    Browser.send('render', {
      type: 'event',
      event: event.pack()
    });
  }

  return {
    triggerEvent
  };

})();
