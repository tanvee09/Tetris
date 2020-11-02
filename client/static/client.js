try {

    (() => {
        const sock = io();

        document.getElementById('roomInpButton').addEventListener('click', () => {
            alert("here");
        });
    })();

} catch (err) {
    alert(err);
}