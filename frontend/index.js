let getData = async (url) => {
  let response = await fetch(url);
  let data = await response.json();
  return data.data;
};

let renderStudents = (array) => {
  let ul = document.querySelector("#studentList");
  ul.innerHTML = "";

  //Skapa en array-kopia
  let students = [...array];

  //Filtrering

  //Sortera på ålder - stigande och fallande
  let sort = document.querySelector("#sortByAge").value;
  if (sort === "Stigande") {
    students.sort((a, b) => a.attributes.age - b.attributes.age);
  } else if (sort === "Fallande") {
    students.sort((a, b) => b.attributes.age - a.attributes.age);
  }

  students.forEach((student) => {
    let { firstName, lastName, age, education, courses, teacher } =
      student.attributes;
    let allCourses = "";
    courses.forEach((course) => (allCourses += course.name + " "));
    let li = document.createElement("li");
    li.innerText = `Name: ${firstName} ${lastName}
        Age: ${age}
        Education: ${education}
        Courses: ${allCourses}
        Teacher: ${
          // W ? T : F
          teacher.data?.attributes.name
            ? teacher.data.attributes.name
            : "Ingen lärare"
        }`;
    ul.append(li);
  });
};

let renderSchoolInfo = (school) => {
  let schoolName = document.querySelector("#schoolName");
  let contactEmail = document.querySelector("#contactEmail");
  let amountOfStudents = document.querySelector("#amountOfStudents");
  let location = document.querySelector("#location");

  schoolName.innerText =
    school.attributes.name + " - " + school.attributes.motto;
  contactEmail.innerText = school.attributes.contactEmail;
  amountOfStudents.innerText = school.attributes.numberOfStudents;
  location.innerText =
    school.attributes.location.city + ", " + school.attributes.location.country;
};

let loadPage = async () => {
  const students = await getData(
    "http://localhost:1338/api/students?populate=*"
  );
  const school = await getData("http://localhost:1338/api/school?populate=*");
  console.log(students);

  // Filtrera utbildning

  let education = document.querySelector("#filterEducation");
  education.addEventListener("change", (event) => {
    console.log(event.target.value);
    let filteredArray = students.filter(
      (student) => student.attributes.education === event.target.value
    );
    if (event.target.value !== "Alla") {
      renderStudents(filteredArray);
    } else {
      renderStudents(students);
    }
  });
  let sortByAge = document.querySelector("#sortByAge");

  sortByAge.addEventListener("change", () => {
    renderStudents(students);
  });

  // Loopa igenom elever och skriv ut dem
  renderSchoolInfo(school);
  renderStudents(students);
};

loadPage();
