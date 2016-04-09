'use strict';

var emoji = exports

var faces = {
  "grinning":"😀","grin":"😁","joy":"😂","smiley":"😃","smile":"😄","sweat_smile":"😅","laughing":"😆","satisfied":"😆","innocent":"😇","smiling_imp":"😈","wink":"😉","blush":"😊","yum":"😋","relieved":"😌","heart_eyes":"😍","sunglasses":"😎","smirk":"😏","neutral_face":"😐","expressionless":"😑","unamused":"😒","sweat":"😓","pensive":"😔","confused":"😕","confounded":"😖","kissing":"😗","kissing_heart":"😘","kissing_smiling_eyes":"😙","kissing_closed_eyes":"😚","stuck_out_tongue":"😛","stuck_out_tongue_winking_eye":"😜","stuck_out_tongue_closed_eyes":"😝","disappointed":"😞","worried":"😟","angry":"😠","rage":"😡","cry":"😢","persevere":"😣","disappointed_relieved":"😥","frowning":"😦","anguished":"😧","fearful":"😨","weary":"😩","sleepy":"😪","tired_face":"😫","sob":"😭","open_mouth":"😮","hushed":"😯","cold_sweat":"😰","scream":"😱","astonished":"😲","flushed":"😳","sleeping":"😴","dizzy_face":"😵","no_mouth":"😶","mask":"😷","smile_cat":"😸","joy_cat":"😹","smiley_cat":"😺","heart_eyes_cat":"😻","smirk_cat":"😼","kissing_cat":"😽","pouting_cat":"😾","crying_cat_face":"😿","scream_cat":"🙀"
}
var extra = {
  "interrobang":"⁉️","tm":"™️","information_source":"ℹ️","left_right_arrow":"↔️","arrow_up_down":"↕️","arrow_upper_left":"↖️","arrow_upper_right":"↗️","arrow_lower_right":"↘️","arrow_lower_left":"↙️","keyboard":"⌨","sunny":"☀️","cloud":"☁️","umbrella":"☔️","showman":"☃","comet":"☄","ballot_box_with_check":"☑️","coffee":"☕️","shamrock":"☘","skull_and_crossbones":"☠","radioactive_sign":"☢","biohazard_sign":"☣","orthodox_cross":"☦","wheel_of_dharma":"☸","white_frowning_face":"☹","aries":"♈️","taurus":"♉️","sagittarius":"♐️","capricorn":"♑️","aquarius":"♒️","pisces":"♓️","spades":"♠️","clubs":"♣️","hearts":"♥️","diamonds":"♦️","hotsprings":"♨️","hammer_and_pick":"⚒","anchor":"⚓️","crossed_swords":"⚔","scales":"⚖","alembic":"⚗","gear":"⚙","scissors":"✂️","white_check_mark":"✅","airplane":"✈️","email":"✉️","envelope":"✉️","black_nib":"✒️","heavy_check_mark":"✔️","heavy_multiplication_x":"✖️","star_of_david":"✡","sparkles":"✨","eight_spoked_asterisk":"✳️","eight_pointed_black_star":"✴️","snowflake":"❄️","sparkle":"❇️","question":"❓","grey_question":"❔","grey_exclamation":"❕","exclamation":"❗️","heavy_exclamation_mark":"❗️","heavy_heart_exclamation_mark_ornament":"❣","heart":"❤️","heavy_plus_sign":"➕","heavy_minus_sign":"➖","heavy_division_sign":"➗","arrow_heading_up":"⤴️","arrow_heading_down":"⤵️","wavy_dash":"〰️","congratulations":"㊗️","secret":"㊙️","copyright":"©️","registered":"®️","bangbang":"‼️","leftwards_arrow_with_hook":"↩️","arrow_right_hook":"↪️","watch":"⌚️","hourglass":"⌛️"
}

emoji.showFaceEmoji = function () {
  showEmoji(faces)
}

emoji.showExtraEmoji = function () {
  showEmoji(extra)
}

emoji.emojify = function (string) {
  var parser = /:([a-zA-Z0-9_\-\+]+):/g;
  string = string.split(parser)
  string[1] = faces[string[1]]
  return string.join('')
}

function emojifyTag(tag){
  return ':'+tag+':'
}

function showEmoji (category) {
  var terminalWidth = process.stdout.columns
  var columnsWith = 20
  var columns = Math.floor(terminalWidth / columnsWith)
  var line = ''
  var i = 0
  for(var key in category) {
    if (key.length > columnsWith - 5) {
      continue
    }

    if (i%columns === 0 && i !== 0) {
      console.log(line)
      line = ''
    }
    line += emojifyTag(key) + ' ' +  faces[key] + '    '
    i++
  }
}