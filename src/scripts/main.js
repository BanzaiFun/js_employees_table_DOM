'use strict';

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco'];
const fieldNames = [
  'Name',
  'Position',
  'Office',
  'Age',
  'Salary',
];
const headerRow = document.querySelector('thead tr');
const tableBody = document.querySelector('tbody');
const form = document.createElement('form');
const body = document.querySelector('body');
const button = document.createElement('button');

button.setAttribute('type', 'submit');

fieldNames.forEach(field => {
  const label = document.createElement('label');
  let input;

  if (field === 'Office') {
    input = document.createElement('select');

    const defaultOtion = document.createElement('option');

    input.append(defaultOtion);

    cities.forEach(city => {
      const option = document.createElement('option');

      option.setAttribute('value', city);
      option.textContent = city;
      input.append(option);
    });
  } else {
    input = document.createElement('input');

    input.setAttribute('type', 'text');
  }

  if (field === 'Age' || field === 'Salary') {
    input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.innerText = `$${field}`;
  }

  input.setAttribute('data-qa', field.toLowerCase());
  input.setAttribute('name', field.toLowerCase());

  label.textContent = field;
  label.append(input);
  form.append(label);
});

form.className = 'new-employee-form';
button.innerText = 'Save to table';

form.append(button);
body.append(form);

// Button

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const entries = Array.from(data.entries());
  const newRow = document.createElement('tr');
  let formValid = true;

  entries.forEach(el => {
    if (el[1] === '') {
      formValid = false;
    }

    const newTd = document.createElement('td');

    newTd.innerText = el[0] === 'salary' ? `$${el[1]}` : el[1];
    newRow.append(newTd);
  });

  if (!formValid) {
    pushNotification(
      20,
      20,
      'Error',
      `Please fill all fields`,
      'error'
    );
  } else {
    tableBody.append(newRow);

    pushNotification(
      20,
      20,
      'Success',
      `New employee saved`,
      'success'
    );

    const formInputs = form.querySelectorAll('input, select');

    formInputs.forEach(clearEl => {
      clearEl.value = '';
    });
  }
});

tableBody.addEventListener('click', e => {
  if (e.target.tagName === 'TD') {
    const classActiveRemove = tableBody.querySelectorAll('tr.active');

    classActiveRemove.forEach(el => {
      el.className = '';
    });
    e.target.parentElement.className = 'active';
  }
});

tableBody.addEventListener('dblclick', e => {
  if (e.target.tagName === 'TD') {
    const bod = tableBody.querySelectorAll('input');
    const newInput = document.createElement('input');

    bod.forEach(input => {
      input.parentElement.innerText = input.value;
      input.remove();
    });

    newInput.setAttribute('type', 'text');
    newInput.value = e.target.innerText;
    newInput.className = 'cell-input';
    e.target.innerText = '';
    e.target.append(newInput);

    newInput.addEventListener('blur', eve => {
      eve.target.parentElement.innerText = eve.target.value;
      eve.target.remove();
    });
  }
});

// Sorted

headerRow.addEventListener('click', e => {
  if (e.target.tagName === 'TH') {
    const headerElements = headerRow.querySelectorAll('th');
    const clickedHeader = [...headerElements].findIndex(th => th === e.target);
    const tableRowsArray = [...document.querySelectorAll('tbody tr')];

    let sortDirection = e.target.getAttribute('data-sort');

    sortDirection = sortDirection
      ? sortDirection === 'asc'
        ? 'desc'
        : 'asc'
      : 'asc';
    e.target.setAttribute('data-sort', sortDirection);

    const sortedRows = tableRowsArray.sort((a, b) => {
      let aTds, bTds;

      if (sortDirection === 'asc') {
        aTds = a.querySelectorAll('td');
        bTds = b.querySelectorAll('td');
      } else {
        aTds = b.querySelectorAll('td');
        bTds = a.querySelectorAll('td');
      }

      if (aTds[clickedHeader].innerText[0] === '$') {
        return aTds[clickedHeader].innerText
          .localeCompare(bTds[clickedHeader]
            .innerText, undefined, { numeric: true });
      }

      return aTds[clickedHeader]
        .innerText.localeCompare(bTds[clickedHeader].innerText);
    });

    sortedRows.forEach(item => {
      tableBody.append(item);
    });
  }
});

// Notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const bodyNotification = document.querySelector('body');
  const h2 = document.createElement('h2');
  const block = document.createElement('div');
  const paragraph = document.createElement('p');

  block.className = `notification ${type}`;
  block.setAttribute('data-qa', 'notification');
  h2.textContent = title;
  h2.className = 'title';
  paragraph.textContent = description;
  block.style.top = `${posTop}px`;
  block.style.right = `${posRight}px`;
  block.append(h2, paragraph);
  bodyNotification.append(block);

  setTimeout(() => {
    block.remove();
  }, 2000);
};
