import React, { useEffect, useState } from "react";

function Page({ title, scope, children }) {
  useEffect(() => {
    document.title = `${title ? title + " | Writescape" : "Writescape"} `;
    window.scrollTo(0, 0);

    // remove all existed scope classes start with namespace: "s-"
    const filteredClassList = Array.from(document.body.classList)
      .map((classItem) => {
        // if the class starts with "s-" don't return
        if (classItem.startsWith("s-")) return;
        // Otherwise, return the remain classes
        return classItem;
      })
      .join(" ");
    console.log(filteredClassList);
    // Reassign the class list of the body element with the filtered one
    document.body.classList = filteredClassList;

    if (scope) {
      // Add the newest class of the page scope
      document.body.classList.add(`s-${scope}`);
    }
  }, [title, scope]);

  return <>{children}</>;
}

export default Page;
