document.getElementById('medicationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('medicationName').value;
    const type = document.getElementById('medicationType').value;
    const price = document.getElementById('medicationPrice').value;

    // Call your backend API to add medication, for now, we just add it to the table
    const newRow = `<tr>
        <td>#</td>
        <td>${name}</td>
        <td>${type}</td>
        <td>${price}</td>
        <td>
            <button class="btn btn-warning">Edit</button>
            <button class="btn btn-danger">Delete</button>
        </td>
    </tr>`;

    document.getElementById('medicationList').innerHTML += newRow;

    // Clear form after adding
    document.getElementById('medicationForm').reset();
});
