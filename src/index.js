import "./styles.scss";
import "bootstrap";
import onChange from "on-change";
import _ from "lodash";
import axios from "axios";
import validator from "./validator.js";
import renderSelector from "./renders.js";
import parseRSS from "./parser.js";

const makeUrl = (url) => {
  const fullUrl = new URL("https://allorigins.hexlet.app/get");
  fullUrl.searchParams.set("url", url);
  fullUrl.searchParams.set("disableCache", true);
  return fullUrl;
};

const refreshRSS = (state, url) => {
  axios.get(makeUrl(url)).then((responce) => {
    const [feed, posts] = parseRSS(responce.data.contents);
    const allPosts = state.posts.flat();
    const findFeed = allPosts.find((item) => {
      const itemHostname = new URL(item.link).hostname;
      const feedHostname = new URL(feed.link).hostname;
      return itemHostname === feedHostname;
    });
    const relatedFeedId = findFeed.feedId;
    const relatedPosts = allPosts.filter((post) => post.feedId === relatedFeedId);
    const newPosts = _.differenceBy(posts, relatedPosts, "link");

    newPosts.forEach((post) => {
      post.id = _.uniqueId();
      post.feedId = relatedFeedId;
    });
    if (newPosts.length > 0) {
      state.posts.unshift(newPosts);
    }
  });
  setTimeout(refreshRSS, 5000, state, url);
};

const makeContent = (parsedFeed, state, url) => {
  const [feed, posts] = parsedFeed;
  const feedId = _.uniqueId();

  posts.forEach((post) => {
    post.id = _.uniqueId();
    post.feedId = feedId;
  });
  state.posts.unshift(posts);

  feed.id = feedId;
  state.feeds.unshift(feed);

  state.isValid = true;

  refreshRSS(state, url);
};

const getRSS = (url, state) => {
  axios
    .get(makeUrl(url))
    .then((responce) => {
      const parsedData = parseRSS(responce.data.contents);
      state.allUrls.push(url);
      makeContent(parsedData, state, url);
    })
    .catch((err) => {
      if (err.message === "parsingError") {
        state.errors = "parsingError";
      } else {
        state.errors = "networkError";
      }
    });
};

export default (state, language) => {
  const elements = {
    formHeader: document.querySelector(".rss-header"),
    startReadingP: document.querySelector(".start-reading"),
    addButton: document.querySelector(".add-button"),
    helpingText: document.querySelector(".helping-text"),
    inputPlaceholder: document.querySelector("#url-input"),
    postList: document.querySelector(".post-list"),
  };

  elements.formHeader.textContent = language.t("rssHeader");
  elements.startReadingP.textContent = language.t("startReading");
  elements.addButton.textContent = language.t("add");
  elements.helpingText.textContent = language.t("helpingText");
  elements.inputPlaceholder.placeholder = language.t("inputPlaceholder");

  const watchedState = onChange(state, (path, value) => renderSelector(path, value, language));
  const inputForm = document.querySelector(".rss-form");
  const input = document.querySelector("#url-input");
  const currentUrls = watchedState.allUrls;

  elements.postList.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.nodeName === "A") {
      window.open(e.target.href);
    }
    if (e.target.hasAttribute("data-feed")) {
      const buttonId = e.target.dataset.id;
      const allPosts = state.posts.flat();
      const relatedPost = allPosts.find((post) => post.id === buttonId);
      watchedState.currentModal = relatedPost;
    }
  });

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const schema = validator(language, currentUrls);
    schema
      .validate({ rssInput: input.value })
      .then(() => {
        getRSS(input.value, watchedState);
        inputForm.reset();
        input.focus();
      })
      .catch(() => {
        const errorType = currentUrls.includes(input.value) ? "already exist" : "not valid";
        watchedState.isValid = errorType;
      });
  });
};
