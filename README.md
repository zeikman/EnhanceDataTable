# EnhanceDataTable (Beta v0.2.0)
EnhanceDataTable is a DataTables plugin that provides a set of useful methods and functionalities to deal with data retrieving, updating, filtering, finding, and etc.

## Properties

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>buttons</td>
      <td>New buttons : 'reload', 'cardview'</td>
    </tr>
    <tr>
      <td>column_hide_in_card</td>
      <td>
        Columns which will be hide when turns into card view, and show again then turns into table view.
        Those hidden columns still able to show out by toggle the column visibilty.
      </td>
    </tr>
    <tr>
      <td>three_states_sort</td>
      <td>
        Three states sorting.<br />
        [ Ascending > Descending > Original ]
    </td>
    </tr>
    <tr>
      <td>show_row_number</td>
      <td>Show row number column.</td>
    </tr>
    <tr>
      <td>show_checkbox</td>
      <td>Show checkbox column.</td>
    </tr>
    <tr>
      <td>checked_visible_only</td>
      <td>'Check/Un-Check All' only apply to visible checkboxes.</td>
    </tr>
    <tr>
      <td>enable_checkbox_event</td>
      <td>Enable built-in checkbox event listener on custom checkbox.</td>
    </tr>
    <tr>
      <td>checkbox_header_class</td>
      <td>Checkbox header class.</td>
    </tr>
    <tr>
      <td>checkbox_class</td>
      <td>Checkbox class.</td>
    </tr>
  </tbody>
</table>

## Methods

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>getAjaxUrl</td>
      <td>Get Ajax URL of DataTables.</td>
    </tr>
    <tr>
      <td>setAjaxUrl</td>
      <td>Set Ajax URL of DataTables.</td>
    </tr>
    <tr>
      <td>getView</td>
      <td>Get current view of DataTables.</td>
    </tr>
    <tr>
      <td>setView</td>
      <td>Set DataTables view.</td>
    </tr>
    <tr>
      <td>toggleView</td>
      <td>Toggle between 'table' and 'card' view.</td>
    </tr>
    <tr>
      <td>getRows</td>
      <td>Get all rows.</td>
    </tr>
    <tr>
      <td>getRowData</td>
      <td>Get data of a row.</td>
    </tr>
    <tr>
      <td>getSelectedRowIds</td>
      <td>Get ID of selected rows.</td>
    </tr>
    <!-- <tr>
      <td>getVisibleSelectedRowIds</td>
      <td>Get ID of visible and selected rows.</td>
    </tr> -->
    <tr>
      <td>getSelectedRowDatas</td>
      <td>Get data of selected rows.</td>
    </tr>
    <!-- <tr>
      <td>getVisibleSelectedRowDatas</td>
      <td>Get data of visible and selected rows.</td>
    </tr> -->
    <tr>
      <td>refresh</td>
      <td>Reload DataTables data.</td>
    </tr>
    <tr>
      <td>on</td>
      <td>
        Register DataTables events listener.<br />
        Refer to <a href="https://datatables.net/reference/api/on()" target="_blank">on()</a>.
      </td>
    </tr>
    <tr>
      <td>search</td>
      <td>Filter data.</td>
    </tr>
    <tr>
      <td>updateData</td>
      <td>Update data.</td>
    </tr>
    <tr>
      <td>clearData</td>
      <td>Clear data.</td>
    </tr>
    <tr>
      <td>resetOrder</td>
      <td>Restore the order in which data was read into a DataTable.</td>
    </tr>
    <tr>
      <td>select</td>
      <td>Select a row.</td>
    </tr>
    <tr>
      <td>deselect</td>
      <td>Deselect a row.</td>
    </tr>
  </tbody>
</table>

## Events

<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>toggleView</td>
      <td>Toggle view event - fired when DataTables view changes.</td>
    </tr>
  </tbody>
</table>