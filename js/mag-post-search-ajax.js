(function ($) {
    $(function () {

        function init(field) {
            if ($(field).attr('data-limit') <= $('#' + $(field).attr('id') + '_results' + ' li').length) {
                $(field).hide();
                // $(field).prop('disabled', 'disabled');
            }
            var fid = $(field).attr('id');
            //todo: suppliment a way to get cat into args so it filters ideally via a seperate look up
            var query_args = $(field).attr('data-queryargs');
            var object = $(field).attr('data-object');
            $(field).devbridgeAutocomplete({
                serviceUrl: psa.ajaxurl,
                type: 'POST',
                triggerSelectOnValidInput: false,
                showNoSuggestionNotice: true,
                params: {
                    action: 'cmb_post_search_ajax_get_results',
                    psacheck: psa.nonce,
                    object: object,
                    query_args: query_args
                },
                onSearchStart: function () {
                    $(field).next('img.cmb-post-search-ajax-spinner').css('display', 'inline-block');
                },
                onSearchComplete: function () {
                    $(field).next('img.cmb-post-search-ajax-spinner').hide();
                },
                onSelect: function (suggestion) {
                    $(field).devbridgeAutocomplete('clearCache');
                    var lid = $(field).attr('id') + '_results';
                    var lname = $(field).attr('name');
                    var limit = $(field).attr('data-limit');

                    $('#' + lid).append('<li><span class="hndl"></span><input type="hidden" name="' + lname + '" value="' + suggestion.data + '"><a href="' + suggestion.guid + '" target="_blank" class="edit-link">' + suggestion.value + '</a><a class="remover"><span class="dashicons dashicons-no"></span><span class="dashicons dashicons-dismiss"></span></a></li>');

                    $(field).val('');
                    if (limit <= $('#' + lid + ' li').length) {
                        $(field).hide();
                        // $(field).prop('disabled', 'disabled');
                    }
                    else {
                        $(field).focus();
                    }
                }
            });

            $('#' + fid + '_results').sortable({
                handle: '.hndl',
                placeholder: 'ui-state-highlight',
                forcePlaceholderSize: true
            });

        }

        document.querySelectorAll('.cmb-post-search-ajax').forEach(function (element) {
            init(element);
        });
        // $('.cmb-post-search-ajax').each(
        // 	init()
        // );
        document.querySelectorAll('.cmb-repeatable-group').forEach(function (element) {
            $(element).on('cmb2_add_row', function (e) {
                element.querySelectorAll('.cmb-post-search-ajax').forEach(function (element) {
                    element.parentNode.querySelectorAll('ul input').forEach(function(ele){
                        if (!ele.value){
                            ele.parentNode.outerHTML="";
                        }
                    });
                    init(element);
                });
            });
        })

        $('.cmb-post-search-ajax-results').on('click', '.remover', function () {
            $(this).parent('li').fadeOut(400, function () {
                var iid = $(this).parents('ul').attr('id').replace('_results', '');
                $(this).remove();
                $('#' + iid).show();
                // $('#' + iid).removeProp('disabled');
                $('#' + iid).devbridgeAutocomplete('clearCache');
            });
        });

    });
})(jQuery);
