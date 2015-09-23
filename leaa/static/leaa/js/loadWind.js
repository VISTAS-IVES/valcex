/**
 * Created by Taylor on 9/2/2015.
 */


//TODO: Update the SODAR Log & Activity label with current record being shown

//TODO: Update the UI controls to be useful

steal(function () {

    //dispIndexArray = [];
    //dispIndexMax = null;

    // Load a set of data from the server
    $("ul").on("click", "a.recordDate", function () {

        // Get the record handles
        recordDate = $(this).html();
        $.getJSON('/getVectors/', {'stations[]':stationNames, 'recordDate':recordDate}, function(result) {
            stationData = result;
        }).done(function() {
                dispIndexArray = [];
                $.each(stationData, function() {
                    dispIndexArray.push(0);
                });
                dispIndexMax = getMaxList();
                dispIndexArray_reset = dispIndexArray.slice();
            }
        );
        console.log(recordDate);
        $("#current-timestamp-label").html(temp_terrain.name + ': ' + recordDate);
    });

    function getMaxList(){
        var maxList = [];
        $.each(stationData, function(name, arrays) {
            maxList.push(arrays['dates'].length);
        });
        return Math.max.apply(Math,maxList);
    }

});