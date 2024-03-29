const renderStatus = (status, language) => {
  const form = document.querySelector("#url-input");
  const statusInfo = document.querySelector(".statusInfo");
  switch (status) {
    case true:
      form.classList.remove("is-invalid");
      statusInfo.textContent = language.t("success");
      statusInfo.classList.replace("errorText", "successText");
      break;
    case "not valid":
      form.classList.add("is-invalid");
      statusInfo.textContent = language.t("url");
      statusInfo.classList.replace("successText", "errorText");
      break;
    case "already exist":
      form.classList.add("is-invalid");
      statusInfo.textContent = language.t("notOneOf");
      statusInfo.classList.replace("successText", "errorText");
      break;
    default:
      throw new Error(`${language.t("wrongStatus")}: ${status}`);
  }
};

const firstRenderFeed = (language) => {
  const feedContainer = document.querySelector(".feeds");
  const feed = document.createElement("div");
  const feedHeader = document.createElement("h2");
  feedHeader.classList.add("card-title", "h4");
  feedHeader.textContent = `${language.t("feeds")}`;

  feed.append(feedHeader);
  feedContainer.append(feed);

  const postContrainer = document.querySelector(".posts");
  const post = document.createElement("div");
  const postHeader = document.createElement("h2");
  postHeader.classList.add("card-title", "h4");
  postHeader.textContent = `${language.t("posts")}`;

  post.append(postHeader);
  postContrainer.prepend(post);

  const modalLink = document.querySelector(".full-article");
  modalLink.textContent = language.t("readAll");
};

const renderPosts = (feedData, language) => {
  const postContainer = document.querySelector(".post-list");

  if (postContainer.childElementCount === 0) {
    firstRenderFeed(language);
  }
  const postList = document.createElement("ul");
  postList.classList.add("list-group", "border-0");
  postContainer.append(postList);

  const [currentFeed] = feedData;

  currentFeed.forEach((item) => {
    const post = document.createElement("li");
    post.classList.add("list-group-item", "d-flex", "justify-content-between");
    postList.append(post);
    const a = document.createElement("a");
    post.append(a);
    a.outerHTML = `<a href="${item.link}" class="fw-bold" data-id="${item.id}" data-feed="${item.feedId}">${item.title}</a>`;

    const button = document.createElement("button");
    post.append(button);
    const viewText = language.t("view");
    button.outerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalWindow" data-id="${item.id}" data-feed="${item.feedId}">${viewText}</button>`;
  });
};

const renderFeed = (feedData) => {
  const [currentFeed] = feedData;
  const feedContainer = document.querySelector(".feeds");
  const feedList = document.createElement("ul");
  feedList.classList.add("list-group", "border-0");
  feedContainer.append(feedList);

  const feed = document.createElement("li");
  feed.classList.add("list-group-item", "border-0");
  const feedTitle = document.createElement("h3");
  feedTitle.textContent = currentFeed.title;
  feed.append(feedTitle);
  const feedDescription = document.createElement("p");
  feedDescription.textContent = currentFeed.description;
  feed.append(feedDescription);
  feedList.append(feed);
};

const renderModal = (post, language) => {
  const { title, description, link } = post;
  const modalTitle = document.querySelector(".modal-title");
  modalTitle.textContent = title;

  const modalBody = document.querySelector(".modal-body");
  modalBody.textContent = description;

  const modalFooter = document.querySelector(".modal-footer");

  modalFooter.querySelector("button").textContent = language.t("close");

  const modalLink = document.querySelector(".full-article");
  modalLink.setAttribute("href", link);

  const postBody = document.querySelector(`a[data-id='${post.id}']`);
  postBody.classList.remove("fw-bold");
  postBody.classList.add("fw-normal");
};

const renderError = (errorMessage, language) => {
  const errorText = language.t(errorMessage);
  const statusInfo = document.querySelector(".statusInfo");
  statusInfo.classList.replace("successText", "errorText");
  statusInfo.textContent = errorText;
};

const renderSelector = (path, value, language) => {
  switch (path) {
    case "allUrls":
      break;
    case "isValid":
      renderStatus(value, language);
      break;
    case "posts":
      renderPosts(value, language);
      break;
    case "feeds":
      renderFeed(value);
      break;
    case "currentModal":
      renderModal(value, language);
      break;
    case "errors":
      renderError(value, language);
      break;
    default:
      throw new Error(`Unknown process State: ${path}`);
  }
};

export default renderSelector;
