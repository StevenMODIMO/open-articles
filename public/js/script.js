const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get input values
  const headline = form.headline.value;
  const content = form.content.value;

  try {
    const res = await fetch("/articles/new", {
      method: "POST",
      body: JSON.stringify({ headline, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    // Clear input fields
    form.headline.value = "";
    form.content.value = "";
    location.assign("/");
  } catch (error) {
    console.log(error);
  }
});

const updateForm = document.querySelector("#update-form");

updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get update values
  const headline = updateForm.headline.value;
  const content = updateForm.content.value;
  const id = updateForm.getAttribute("action").split("/").pop();

  try {
    const res = await fetch(`/articles/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ headline, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);

    // Clear input fields
    updateForm.headline.value = "";
    updateForm.content.value = "";
    location.assign("/");
  } catch (error) {
    console.log(error);
  }
});
