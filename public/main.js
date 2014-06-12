requirejs(['lib/sockethelper', 'jquery', 'lib/visualizer', 'bootstrap'],
  function(sockethelper, $, Visualizer) {
    var socket = sockethelper.getSocket();

    var vis = new Visualizer(socket);
    vis.load();
});
