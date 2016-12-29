function decryptAES() {
    var passphrase = document.getElementById("passphrase").value;
    var transitmessage = document.getElementById("enc_content").innerHTML;
    var transithmac = transitmessage.substring(0, 64);
    var transitencrypted = transitmessage.substring(64);
    var decryptedhmac = CryptoJS.HmacSHA256(transitencrypted, CryptoJS.SHA256(passphrase)).toString();
    if (transithmac != decryptedhmac) {
        alert("密码错误！");
        return;
    }
    var decrypted = CryptoJS.AES.decrypt(transitencrypted, passphrase).toString(CryptoJS.enc.Utf8);
    var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    document.getElementById("enc_content").innerHTML = plaintext;
    document.getElementById("enc_content").style.display = "inline";
    document.getElementById("security").style.display = "none";

    wrapImageWithFancyBox();
}

/**
 * Wrap images with fancybox support.
 */
function wrapImageWithFancyBox() {
    $('#enc_content img').not('.group-picture img, .post-gallery img').each(function () {
        var $image = $(this);
        var imageTitle = $image.attr('title');
        var $imageWrapLink = $image.parent('a');

        if ($imageWrapLink.size() < 1) {
            $imageWrapLink = $image.wrap('<a href="' + this.getAttribute('src') + '"></a>').parent('a');
        }

        $imageWrapLink.addClass('fancybox');
        $imageWrapLink.attr('rel', 'group');

        if (imageTitle) {
            $imageWrapLink.append('<p class="image-caption">' + imageTitle + '</p>');
            $imageWrapLink.attr('title', imageTitle); //make sure img title tag will show correctly in fancybox
        }
    });

    $('.fancybox').fancybox({
        helpers: {
            overlay: {
                locked: false
            }
        }
    });
}

// add enter to decrypt
addLoadEvent(function() {
    document.getElementById("passphrase").onkeypress = function(keyPressEvent) {
        if (keyPressEvent.keyCode === 13) {
            decryptAES();
        }
    };
});

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}
