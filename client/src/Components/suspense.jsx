import React from "react";
import Gif from "../../icons/loading.gif";

const SuspenseGif = () => {
  return (
    <div style={{ width: "100%", textAlign: "center", padding: "5rem" }}>
      <img src={Gif} width="120" height="100" />
      <p>
        <a href="https://gifer.com/en/ZKZg">via GIPHY</a>
      </p>
    </div>
  );
};

export default SuspenseGif;
