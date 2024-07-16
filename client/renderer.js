window.Renderer = (function() {

  let $currentState;

  // TODO: Event will need to be a different view type. I should figure out a
  //       way for events to take branching paths rather than having paths be
  //       separate events.

  // TODO: Really we should separate all this into different renders. Just need
  //       to figure out why they IPC stuff wasn't working.

  function init() {
    ServerEvents.onRender((event, data) => {
      if (data.showView) { return showView(data) }

      // There will be more types I think...
      switch (data.type) {
        case 'alert': return Alert.showServerAlert(data);
        case 'note':  return NoteManager.show(data.code);
        case 'event': return EventView.show(data);
        default:
          console.error("=== Unknown Render Type ===");
          console.error("Data:",data)
      }
    });
  }

  function getCurrentState() {
    return $currentState;
  }

  function showView(data) {
    $currentState = data;

    let showFunction = {
      DungeonView: DungeonView.show,
    }[$currentState.showView];

    if (showFunction == null) {
      return console.error(`Error: No view named "${$currentState.showView}"`);
    }

    showFunction($currentState);
  }

  return {
    init,
    getCurrentState,
  };

})();
