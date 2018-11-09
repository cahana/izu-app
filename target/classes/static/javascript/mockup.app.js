


    $(document).ready(function() {
        $('#purpose').on('change', function() {
            if ( this.value == '2') {
                $("#upload").show();
            } else {
                $("#upload").hide();
            }
        });
    });

    $(document).ready(function() {
        var max_fields      = 10; //maximum input boxes allowed
        var wrapper         = $(".input_fields_wrap"); //Fields wrapper
        var add_button      = $(".add_field_button"); //Add button ID
        var x = 1; //initlal text box count

        $(add_button).click(function(e) {
            e.preventDefault();
            if (x < max_fields) {
                x++;
                $(wrapper).append('<div><input id="append" type="text" name="mytext[]"/><a href="#" class="remove_field"><button name="remove_levels" value="delete" class="btn btn-secondary glyphicon glyphicon-trash btn-lg background-color" style="padding-left:10px;"></button></a></div>' );
            }
        });

        $(wrapper).on("click",".remove_field", function(e) {
            e.preventDefault();
            $(this).parent('div').remove(); x--;
        });
    });

   function toggler(divId) {
       $("#" + divId).toggle();
   }

    $(document).ready(function() {
        $('#reason').on('change', function() {
            if ( this.value == '1') {
                $("#comment").show();
            } else {
                $("#comment").hide();
            }
        });
    });

    $( function() {
    $( ".dragable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( ".dragable" ).disableSelection();
  } );