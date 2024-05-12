import net, {Socket} from 'net';

const client = new Socket();
const port = 8008;
const host = 'localhost';

client.connect(port, host, function() {
    console.log('Connected');
    client.write("Hello From Client " + client.address());
});