requirejs(['lib/sockethelper', 'jquery', 'lib/visualizer'],
  function(sockethelper, $, Visualizer) {
    var socket = sockethelper.getSocket();

    var vis = new Visualizer(socket);
    vis.load();
});
