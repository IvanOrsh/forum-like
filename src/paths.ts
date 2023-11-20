const paths = {
  home() {
    return "/";
  },

  topicShow(topicSlug: string) {
    return `/topics/${topicSlug}`;
  },

  postCreate() {},

  postShow() {},
};

export default paths;
