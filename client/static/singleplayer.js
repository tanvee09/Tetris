try {

    (() => {
        setInterval(async function() {
            if (!paused && !gameOver && !init_load) {
                decisecs += 1;
                if (decisecs == 10) {
                    decisecs = 0;
                    secs += 1;
                }
                if (secs == 60) {
                    secs = 0;
                    mins += 1;
                }
                var dispTime = '';
                if (mins < 10) {
                    dispTime += '0';
                }
                dispTime += mins + ':';
                if (secs < 10) {
                    dispTime += '0';
                }
                dispTime += secs + '.';
                dispTime += decisecs;

                timeElement.innerHTML = dispTime;
                if (multiplayeMode == true && dispTime == "01:00.0") {
                    alert("one minute over bruh");
                    gameOver = true;
                    document.getElementById('scoreDisp').innerHTML = score;
                    document.getElementById('endOverlay').style.display = '';
                }
            }
        }, 100);

        
        // function startScreen() On start wait 3 seconds
        {
            document.getElementById('overlay').style.display = "block";
            f1();

            function f1() {
                document.getElementById('overlay').innerHTML = "Ready|3";
                setTimeout(f2, 1000);
            }

            function f2() {
                document.getElementById('overlay').innerHTML = "Set|2";
                setTimeout(f3, 1000);
            }

            function f3() {
                document.getElementById('overlay').innerHTML = "Go|1";
                setTimeout(f4, 1000);
            }

            function f4() {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('overlay').innerHTML = "Game Paused";
                init_load = 0;
            }
        }
    })();

    

} catch(err) {
    alert(err);
}