import hasPermi from "./permission/hasPermi";

export default {
  install(app) {
    app.directive("hasPermi", hasPermi);
  },
};
