requirejs(['lib/sockethelper', 'jquery', 'd3'],
  function(sockethelper, $, d3) {
    var socket = sockethelper.getSocket();

    $.getJSON('/users', function(data) {
      $('#console').text(data);
    });
});
