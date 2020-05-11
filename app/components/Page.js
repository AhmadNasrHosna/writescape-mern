import React, { useEffect } from "react";

function Page({ title, children }) {
  useEffect(() => {
    document.title = `${title ? title + " | Writescape" : "Writescape"} `;
    window.scrollTo(0, 0);
  }, [title]);

  return <>{children}</>;
}

export default Page;
