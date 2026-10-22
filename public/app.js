const socket = io();
let userId = "";

async function pair() {
    const phone = document.getElementById('phone').value;
    if (!phone) return alert("Number likho!");

    const res = await fetch('/api/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: phone })
    });
    const data = await res.json();
    
    if (data.error) return alert(data.error);
    
    userId = data.userId;
    socket.emit('join', userId);
    
    document.getElementById('codeArea').style.display = 'block';
    document.getElementById('codeArea').innerText = "Code: " + data.code;
    
    // Check connection every 3 seconds
    setInterval(async () => {
        const r = await fetch('/api/status/' + userId);
        const s = await r.json();
        if (s.isConnected) {
            document.getElementById('stage1').style.display = 'none';
            document.getElementById('stage2').style.display = 'block';
        }
    }, 3000);
}