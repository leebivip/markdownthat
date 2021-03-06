/**
 * Insert markdown that button into button list below each reddit post.
 */
function insertButtonReddit() {
  // if the url matches a reddit post, add markdown that button
  if (/[\w\W]*reddit.com\/r\/[\w\W]+\/comments\//.test(document.location.href)) {
    console.log("Buttons being inserted");
    // button list below all reddit posts
    var buttonsList = $("ul.flat-list.buttons");
    // add markdown button under all posts and comments
    buttonsList.append(function() {
      // necessary so that "load more comments" is not included
      if (this.children.length > 0 && !$(this).hasClass("mdt-inserted")) {
        return '<li><a href="javascript:void(0)" class="mdt-button">markdown that</a></li>';
      }
    });
    // for keeping track of where mtd button is added
    buttonsList.addClass("mdt-inserted");

    // when user clicks on markdown button
    $(".mdt-button").click(function() {
      // nearest div object will be the post associated with the markdown
      // button that is pressed
      var divContent = $(this).closest("div");
      sendMessageToBackground(getRedditPostData(divContent));
    });

    $("span.morecomments > a").click(function() {
      console.log("More comments!");
      setTimeout(insertButtonReddit, 1000);
    });
  }
}

/**
 * Get reddit post information from a jQuery selector. Information includes:
 * title, author, date, url, and the post html.
 *
 * @param {Object} divContent - jQuery selector of reddit post div
 * @returns {Object} object containing reddit post information
 */
function getRedditPostData(divContent) {
  var message = {
    "from": "postData",
    "title": getRedditPostTitle(divContent),
    "author": getRedditAuthor(divContent),
    "date": getRedditDate(divContent),
    "url": getRedditUrl(divContent),
    "html": getRedditHtml(divContent)
  };
  return message;
}

/**
 * Get the title of the reddit post or comment.
 *
 * @param {Object} containerElement - jQuery object containing reddit post
 * @returns {string} title - title of the reddit post
 */
function getRedditPostTitle(containerElement) {
  // set title to title of post
  var title = $("a.title").text();
  var titleElement = $(containerElement).find("a.title");
  // if no title selector in containerElement, the post is a comment
  if (!titleElement[0]) {
    title += " comment";
  }
  return title;
}

/**
 * Get author of reddit post or comment.
 *
 * @param {Object} containerElement - jQuery object containing post
 * @returns {string} author of the reddit post or comment
 */
function getRedditAuthor(containerElement) {
  var authorElement = $(containerElement).find("a.author");
  return authorElement.text();
}

/**
 * Get date of reddit post or comment.
 *
 * @param {Object} containerElement - jQuery object containing reddit post
 * @returns {string} date of the reddit post or comment
 */
function getRedditDate(containerElement) {
  var timeElement = $(containerElement).find("time");
  console.log(timeElement);
  // substring contains only date and not time
  var date = timeElement.attr("datetime").substring(0, 10);
  return date;
}

/**
 * Get url of reddit post or comment.
 *
 * @param {Object} containerElement - jQuery object containing reddit post
 * @returns {string} url of the reddit post or comment
 */
function getRedditUrl(containerElement) {
  // url is set to document URL by default, necessary since posts don't have
  // an a.bylink tag
  var url = document.URL;

  var premalinkElement = $(containerElement).find("a.bylink");
  if (premalinkElement[0]) { // comments will produce a permalink
    url = premalinkElement.attr("href");
  }
  return url;
}

/**
 * Get the html of reddit post or comment.
 *
 * @param {Object} containerElement - jQuery object containing reddi tpost
 * @returns {string} html of reddit post or comment
 */
function getRedditHtml(containerElement) {
  var postElement = $(containerElement).find("div.md");
  var html = postElement.html();
  return html;
}

insertButtonReddit(); // insert markdown that button when document loads
