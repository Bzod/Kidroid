/**
 * Created by anton_gorshenin on 25.05.2015.
 */
    socket.on('displayData', function (data) {
        html = '';
        for (i in data)
            html += "<tr><td>"+data[i].device_id+"</td><td>"+data[i].registered+"</td><td>"+data[i].school+"</td><td>"+data[i].apk_version+"</td><td><button onclick='showmap("+data[i].longitude+","+data[i].latitude+")'>show map</button></td></tr>";
        $("#userTable").html(html);
    });

        socket.on('quantity', function (data) {
            console.log(data);
    });