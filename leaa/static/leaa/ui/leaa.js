/**
 * Created by Taylor on 9/8/2015.
 */

var VERSION ='1.0.1';

var manager;

var terrains = [];
$.getJSON('/terrains/')
    .done(function(json) {
        $.each(json, function(id, item) {
            terrains.push(item);
        });
    }
);

$(document).ready(function() {

    // External scripts
    steal("leaa/js/stats.min.js", function() {});
    steal("leaa/js/dat.gui.min.js", function() {});
    steal("leaa/three/three.min.js", function() {});
    steal("leaa/three/CombinedCamera.js", function() {});
    steal("leaa/three/OrbitControls.js", function() {});
    steal("leaa/three/TerrainLoader.js", function() {});
    steal("leaa/three/Screenshot.js", function() {});

    // Core Scripts
    steal("leaa/core/stations.js", function() {});
    steal("leaa/core/arrows.js", function() {});
    steal("leaa/core/timeline.js", function() {});
    steal("leaa/core/VisManager.js", function() {
        manager = new VisManager(); //Our manager that holds everything together
    });
    steal("leaa/core/sprites.js", function() {});
    steal("leaa/js/whammy.js", function() {});
    steal("leaa/ui/settings.js", function() {});
    steal("leaa/ui/loader.js", function() {}); // Load rendering tools

    // Playback UI controls
    steal(function() {
        $('#forward').on('click', function() {
            manager.StepForward();
        });
        $('#back').on('click', function() {
            manager.StepBackward();
	    });

        $('#begin').on('click', function() {
            manager.ResetStations();
        });
        // Enable animation
	    $('#play').on('click', function() {
            var glyph = $('#play-glyph');
            if (glyph.hasClass('glyphicon-play')) {
                manager.StepForward();
                manager.Animating = true;
                intervalID = setInterval(animateStepForward, 1000/4);
                glyph.removeClass('glyphicon-play');
                glyph.addClass('glyphicon-pause');
            } else {
                stopAnimation();
                glyph.removeClass('glyphicon-pause');
                glyph.addClass('glyphicon-play');
            }
	    });
        $('#rec_btn').on('click', function() {
            var glyph = $('#play-glyph');
            if ($(this).hasClass('recording')) {
                manager.Recording = false;
                var blob = window.URL.createObjectURL(Whammy.fromImageArray(frames, 1000/ 60));
                window.open(blob);
                stopAnimation();
                $(this).removeClass('recording');
                glyph.removeClass('glyphicon-pause');
                glyph.addClass('glyphicon-play');
                frames = [];
            } else {
                var message = [
                    'Begin capturing scene?',
                    'This will affect system performance,',
                    'and may not work on all browsers.',
                    '\n\v',
                    'Recommendation: use Chrome if you have issues with this feature.'
                ].join(' ');
                var proceed = confirm(message);
                if (proceed) {
                    //recorder.record();
                    glyph.removeClass('glyphicon-play');
                    glyph.addClass('glyphicon-pause');
                    $(this).addClass('recording');
                    manager.StepForward();
                    console.log('merp');
                    manager.Animating = true;
                    manager.Recording = true;
                    intervalID = setInterval(animateStepForward, 1000/2);
                }
            }
        });
        // Animation loop
        function animateStepForward() {
            console.log('merp');
            manager.StepForward();
        }
        // Disable animation
        function stopAnimation() {
            manager.Animating = false;
            clearInterval(intervalID);
        }
	    // RESET
	    $('#reset').on('click', function() {
                if (manager.Animating) {
                    stopAnimation();
                }
                manager.ResetStations();
                orbit.reset();
                camera.position.set(CAM_START.x, CAM_START.y, CAM_START.z);
            }
        );
    });

    /**
     * Our timeline slider.
     * Initialized to be disabled with dummy values because we don't know what the begin/end values are yet.
     * When enabled, the stop event triggers a render event based on the timestamp that it receives
     */
    $(function() {
        var s = $("#timelineSlider");
        s.slider({
            disabled: true,
            value:0,
            min: 0,
            max: 1,
            step: 1,
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.value );
                if (manager.LiveUpdate) manager.UpdateTimeline(ui.value);
            },
            // This is triggered when a user picks up and drops the slider.
            stop: function( event, ui ) {
                if (!manager.LiveUpdate) manager.UpdateTimeline(ui.value);
            }
        });
        $( "#amount" ).val( "$" + s.slider("value"));
    });
    // Tooltips
    $(function() {
        $('[data-toggle="tooltip-std"]').tooltip({placement: 'right', container: 'body'})
    });
    $(function() {
        $('[data-toggle="tooltip"]').tooltip({container: 'body'})
    });
    $(function() {
        $('.dropdown-toggle').dropdown();
    });
    $("#closehowtomodal").click(function() {
        $("#howtovideo")[0].pause();
    })
});