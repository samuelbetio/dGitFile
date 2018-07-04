$(function () {
    /**************************************************************/
    // Initialize Isotope
    var $notes = $(".notes").isotope({
        itemSelector: ".note"
        , layoutMode: 'packery'
    });
    /**************************************************************/
    /****************************************************************/
    //on filter button click
    $(".menu .my_btn").click(function (e) {
        var $this = $(this);
        //    prevent default behaviour
        e.preventDefault();
        //get the data attribute from the button
        var $filter = $this.attr("data-filter")
        $notes.isotope({
            filter: $filter
        });
        //add/remove class
        $(".menu .my_btn").removeClass("btn_active");
        $this.addClass("btn_active")
    });
    /****************************************************************/
});