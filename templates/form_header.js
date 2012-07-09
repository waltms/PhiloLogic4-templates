<script type="text/javascript">
function monkeyPatchAutocomplete() {
    //taken from http://stackoverflow.com/questions/2435964/jqueryui-how-can-i-custom-format-the-autocomplete-plug-in-results    
    
    // don't really need this, but in case I did, I could store it and chain
    var oldFn = $.ui.autocomplete.prototype._renderItem;

    $.ui.autocomplete.prototype._renderItem = function( ul, item) {
        // This regex took some fiddling but should match beginning of string and
        // any match preceded by a string: this is useful for sql matches.
        var re = new RegExp('((^' + this.term + ')|( ' + this.term + '))', "gi") ; 
        var t = item.label.replace(re,"<span style='font-weight:bold;color:Red;'>" + 
                "$&" + 
                "</span>");
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + t + "</a>" )
            .appendTo( ul );
    };
}

function autocomplete_metadata(metadata, field) {
    $("#" + field).autocomplete({
        source: "/philo4/${dbname}/scripts/metadata_list.py?field=" + field,
        minLength: 2,
        dataType: "json"
    });
}

var fields = ${repr(db.locals['metadata_fields'])}


// These functions are for the kwic bibliography whic is shortened by default
function showBiblio() {
    $(this).find("#end_biblio").show(200);
}

function hideBiblio() {
    $(this).find("#end_biblio").hide(200);
}

$(document).ready(function(){
    
    $(".show_search_form").click(function() {
        link = $(this).text()
        if (link == 'Show search form') {
            $(".form_body").slideDown()
            $(this).empty().append('Hide search form')
        }
        else {
            $(".form_body").slideUp()
            $(this).empty().append('Show search form')
        }
    });
    
    monkeyPatchAutocomplete();    
    
    $("#q").autocomplete({
        source: "/philo4/${dbname}/scripts/term_list.py",
        minLength: 2,
        "dataType": "json"
    });
    for (i in fields) {
        var  metadata = $("#" + fields[i]).val();
        var field = fields[i];
        autocomplete_metadata(metadata, field)
    }
//    The following is to display the right options when using the back button
    if ($("#report option[value='concordance']").attr('selected')) {
        $("#frequency").hide()
        $("#collocation").hide()
        $("#theme_rheme").hide()
        $("#results_per_page").show()
    }
    if ($("#report option[value='kwic']").attr('selected')) {
        $("#frequency").hide()
        $("#collocation").hide()
        $("#theme_rheme").hide()
        $("#results_per_page").show()
    }
    if ($("#report option[value='collocation']").attr('selected')) {
        $("#frequency").hide()
        $("#results_per_page").hide()
        $("#theme_rheme").hide()
        $("#collocation").show()
    }
    if ($("#report option[value='frequency']").attr('selected')) {
        $("#collocation").hide()
        $("#results_per_page").hide()
        $("#theme_rheme").hide()
        $("#frequency").show()
    }
    if ($("#report option[value='relevance']").attr('selected')) {
        $("#frequency").hide()
        $("#collocation").hide()
        $("#theme_rheme").hide()
        $("#results_per_page").show()
    }
    if ($("#report option[value='theme_rheme']").attr('selected')) {
        $("#frequency").hide()
        $("#collocation").hide()
        $("#theme_rheme").show()
        $("#results_per_page").show()
    }
    
//  This is for displaying the full bibliogrpahy on mouse hover
//  in kwic reports
    var config = {    
        over: showBiblio, 
        timeout: 500,  
        out: hideBiblio   
    };
    $(".kwic_concordance").hoverIntent(config)
    
// This will show more context for concordance and theme-rheme searches    
    $(".more_context").click(function() {
        var context_link = $(this).text();
        if (context_link == 'Show more context') {
            $(this).prevAll('.philologic_context:last').children('.begin_concordance').show()
            $(this).prevAll('.philologic_context:last').children('.end_concordance').show()
            $(this).empty().fadeIn().append('Hide')
        } 
        else {
            $(this).prevAll('.philologic_context:last').children('.begin_concordance').hide()
            $(this).prevAll('.philologic_context:last').children('.end_concordance').hide()
            $(this).empty().fadeIn().append('Show more context')
        }
    });
       
});

function showHide(value) {
    if (value == 'frequency') {
        $("#collocation").hide()
        $("#results_per_page").hide()
        $("#theme_rheme").hide()
        $("#frequency").show()
    }
    if (value == 'collocation') {
        $("#frequency").hide()
        $("#results_per_page").hide()
        $("#theme_rheme").hide()
        $("#collocation").show()
    }
    if (value == 'concordance' || value == 'kwic' || value == 'relevance') {
        $("#frequency").hide()
        $("#collocation").hide()
        $("#theme_rheme").hide()
        $("#results_per_page").show()
    }
    if (value == 'theme_rheme') {
        $("#frequency").hide()
        $("#collocation").hide()
        $("#theme_rheme").show()
        $("#results_per_page").show()
    }
}

</script>