let test, dt;

$(document).ready(function() {

  /**
   * ========== ========== ========== ========== ========== ==========
   *
   * Default Layout
   */

  const $DataTable = new EnhanceDataTable({
    /**
     * EnhanceDataTable property
     */
    id: '#DataTable',

    // column to auto-hide during card view
    column_hide_in_card: [],

    // 3 states sort: asc, desc, original
    // three_states_sort: false,

    // show row number
    // show_row_number: false,

    // show checkbox
    // show_checkbox: true,

    /**
     * DataTable original property
     */
    autoWidth: false,

    // no default sorting
    order: [],

    // NOTE: test lodash merge - https://lodash.com/
    language: {
      // searchPlaceholder: 'test',
      // paginate: {
      //   // feather
      //   // previous: '<i data-feather="arrow-left"></i>',
      //   // fontawesome
      //   previous: '<i class="fa-solid fa-arrow-left"></i>',
      //   next    : '<i class="fa-solid fa-arrow-right"></i>',
      //   // previous: '<i class="fa-solid fa-chevron-left"></i>',
      //   // next    : '<i class="fa-solid fa-chevron-right"></i>',
      // }
    },
    lengthMenu:
      /*/
      [10, 25, 50, 75, 100],
      /*/
      [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      //*/
    columns: [
      //*/
      {
        data: 'checkbox',
        /*/
        // DataTable default checkbox className
        // className: 'select-checkbox',
        /*/
        // customize checkbox
        sortable: false,
        className: 'dt-center',
        render: function (data, type, row, meta)
        {
          // console.warn('====')
          // console.log(data)
          // console.log(type)
          // console.log(row)
          // console.log(meta)

          // return `<input type="checkbox" class="form-check-input column-checkbox" data-id="${row.id}" />`;
          return `<input type="checkbox" class="form-check-input column-checkbox" />`;
        },
        //*/
      },
      //*/
      {
        data: 'column1',
        width: '20%',
      },
      {
        data: 'column2',
        width: '20%',
      },
      {
        data: 'column3',
        width: '20%',
      },
      {
        data: 'column4',
        width: '20%',
      },
      {
        data: 'column5',
      },
    ],

    // https://datatables.net/examples/api/select_row.html
    /*/
    select: true,
    /*/
    select: {
      style: 'multiple', // api | single | multi | os | multi-shift
      selector: 'td:nth-child(2) input[type="checkbox"]',
      // selector: 'td:first-child',
    },
    //*/

    /*/
    ajax: {
      url: 'data.txt',
      dataSrc: function(data) {
        data.map(function(d) {
          d.rowNumber = '';

          return d;
        });

        return data;

      },
    },
    //*/

    createdRow: function (row, data, dataIndex)
    {
      $(row).attr('data-id', data.id);
    },

    initComplete: function(settings, json) {
      // feather.replace({ 'aria-hidden': 'true' });

      $('#DataTable').on('click', '.column-checkbox-header input[type="checkbox"]', function(e) {
        if (this.checked) {
          $DataTable.dataTable.rows().select();

          $DataTable.dataTable.cells(null, 1).every(function (cell)
          {
            this.data(true);
          });

          // $('#DataTable tbody tr').addClass('selected');
          $('#DataTable tbody td .column-checkbox').attr('checked', true);

        } else {
          $DataTable.dataTable.rows().deselect();

          $DataTable.dataTable.cells(null, 1).every(function (cell)
          {
            this.data(false);
          });

          // $('#DataTable tbody tr').removeClass('selected');
          $('#DataTable tbody td .column-checkbox').attr('checked', false);
        }
      });

      $('#DataTable').on('change', '.column-checkbox', function(e) {
        // const dataId = $(this).data('id');
        // console.log(dataId)

        console.log('ori.change.column-checkbox')

        const totalRows = $DataTable.dataTable.data().length;
        const selectedRows = $DataTable.dataTable.rows('.selected').data().length;

        // return;
        if (this.checked)
        {
          if (selectedRows == totalRows)
            $('.column-checkbox-header input[type="checkbox"]').prop('indeterminate', false);
          else
            $('.column-checkbox-header input[type="checkbox"]').prop('indeterminate', true);
        }
        else
        {
          if (selectedRows == 0)
            $('.column-checkbox-header input[type="checkbox"]').prop('indeterminate', false);
          else
            $('.column-checkbox-header input[type="checkbox"]').prop('indeterminate', true);
        }
      });
    },

    rowCallback: function(row, data, displayNum, displayIndex, dataIndex) {
      // console.log(row)
      // console.log(data)
      // console.log(displayNum)
      // console.log(displayIndex)
      // console.log(dataIndex)

      if (data.checkbox)
      {
        $('input[type="checkbox"]', row).attr('checked', true);
        // $(row).addClass('selected');
      }
      else
      {
        $('input[type="checkbox"]', row).attr('checked', false);
        // $(row).removeClass('selected');
      }
    },

  });

  const data = [];

  for (let index = 0; index < 1000; index++) {
    data.push({
      // NOTE: must provide 'rowNumber' if 'show_row_number = true'
      rowNumber : '',
      checkbox  : false,
      id        : index + 1,
      column1   : `data column1 ${index + 1}`,
      column2   : `data column2 ${index + 1}`,
      column3   : `data column3 ${index + 1}`,
      column4   : `data column4 ${index + 1}`,
      column5   : `data column5 ${index + 1}`,
    });
  }
  // console.log(data);

  //*/
  $DataTable
    .dataTable
    .rows
    .add(data)
    .draw();
  //*/

  test = $DataTable;
  dt = $DataTable.dataTable;

  $('#btn_getselectedrowdatas').on('click', function(e) {
    console.log($DataTable.getSelectedRowDatas());
  });

  $('#btn_getselectedrowids').on('click', function(e) {
    console.log($DataTable.getSelectedRowIds());
  });

  /**
    * ========== ========== ========== ========== ========== ==========
    *
    * Custom Layout
    */

  const $DataTable_Custom = new EnhanceDataTable({
    /**
      * EnhanceDataTable property
      */
    id: '#DataTable_Custom',

    /**
      * DataTable original property
      */
    autoWidth: false,

    // no default sorting
    order: [],

    language: {
      info        : 'Showing _START_ to _END_ of _TOTAL_ rows', // 'Showing _START_ to _END_ of _TOTAL_ entries'
      infoFiltered: '',                                         // '(filtered from _MAX_ total entries)'
      lengthMenu  : '_MENU_ rows per page',                     // 'Show _MENU_ entries'
      paginate: {
        previous: '<i class="fa-solid fa-arrow-left"></i>',
        next    : '<i class="fa-solid fa-arrow-right"></i>',
      }
    },

    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, 'All'],
    ],

    columns: [
      {
        data: 'column1',
        width: '20%',
      },
      {
        data: 'column2',
        width: '20%',
        visible: false,
        // render: DataTable.render.date('YYYY-MM-DD'),
        // render: DataTable.render.moment('YYYY-MM-DD'),
        render: function(data, type, row, meta) {
          const process_date = moment(data).format('YYYY-MM-DD');

          return $DataTable_Custom.getView() == 'card'
            ? `<label class="cardview-col-header">Column2</label> ${process_date}`
            : process_date;
        },
      },
      {
        data: 'column3',
        width: '20%',
        visible: false,
      },
      {
        data: 'column4',
        width: '20%',
      },
      {
        data: 'column5',
      },
    ],

    column_hide_in_card: [
      2, // Column2
      3, // Column3
    ],

    dom:
      `<'row'
        <'col-sm-6'
          <'dt-custom-search'f>
        >
        <'col-sm-6'
          <'dt-custom-buttons'B>
        >
      >
      <'row'
        <'col-sm-12'tr>
      >
      <'row'
        <'col-sm-5'
          <'dt-custom-paging'il>
        >
        <'col-sm-7'p>
      >`,

    buttons: [
      // custom button
      /*/
      {
        text: 'custom button',
        action: function(e, dt, node, config)
        {
          console.log(e)
          console.log(dt)
          console.log(node)
          console.log(config)
        }
      },
      //*/
      {
        extend    : 'reload',
        text      : '<i class="fa-solid fa-sync"></i>',
        titleAttr : 'Reload',
      },
      {
        extend    : 'colvis',
        text      : 'Toggle Column',
        titleAttr : 'Show/Hide Column',
        columns   : ':not(.column-row-number)',
        align     : 'button-right',
        postfixButtons: [ 'colvisRestore' ],
      },
      {
        extend    : 'cardview',
        text      :
          `<i class="fa-solid fa-table"></i>
          <i class="fa-solid fa-arrows-h fa-fw"></i>
          <i class="fa-solid fa-id-card"></i>`,
        titleAttr : 'Toggle Table/Card',
      },
      // 'copy',
      // 'pdf',
    ],

    initComplete: function(settings, json) {
      /* $('.dt-reload-button, .dt-toggle-view-button').addClass('btn-secondary'); */
    },
  });

  test_custom = $DataTable_Custom;
  dt_custom = $DataTable_Custom.dataTable;

  $DataTable_Custom.on('toggleView', (e) => {
    console.log(e.detail.view)
  });

  const data_custom = [];
  let today_date = moment().format('YYYY-MM-DD  hh:mm:ss');
      today_date = new Date();

  data.forEach(function(d, index) {
    data_custom.push({
      ...d,
      ... {
        column2: today_date,
      }
    });
  });

  $DataTable_Custom.updateData(data_custom);

  /**
    * Returns a random number between min (inclusive) and max (exclusive)
    */
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
    * Returns a random integer between min (inclusive) and max (inclusive).
    * The value is no lower than min (or the next integer greater than min
    * if min isn't an integer) and no greater than max (or the next integer
    * lower than max if max isn't an integer).
    * Using Math.round() will give you a non-uniform distribution!
    */
  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  $('#btn_update_data').on('click', function(e) {
    const updateData = [];

    for (let i = 0; i < getRandomInt(10, 100); i++) {
      updateData.push({
        // NOTE: must provide 'rowNumber' if 'show_row_number = true'
        rowNumber : '',
        checkbox  : false,
        id        : i + 1,
        column1   : `data ${getRandomArbitrary(0, 100)}`,
        column2   : `data ${getRandomArbitrary(0, 100)}`,
        column3   : `data ${getRandomArbitrary(0, 100)}`,
        column4   : `data ${getRandomArbitrary(0, 100)}`,
        column5   : `data ${getRandomArbitrary(0, 100)}`,
      });
    }

    $DataTable_Custom.updateData(updateData);
  });

  /**
    * ========== ========== ========== ========== ========== ==========
    *
    * Simple Layout
    */

  const $DataTable_Simple = new EnhanceDataTable({
    id: '#DataTable_Simple',
    show_row_number: false,
    show_checkbox: true,
    // checked_visible_only: true,
    autoWidth: false,
    order: [],
    /*/
    select: {
      style: 'os',
      selector: 'td, th',
    },
    //*/
    language: {
      lengthMenu: 'Items per page _MENU_',
      paginate: {
        previous: '<i class="fa-solid fa-arrow-left"></i>',
        next    : '<i class="fa-solid fa-arrow-right"></i>',
      }
    },
    columns: [
      {
        data: 'column1',
        // sortable: false,
        render: function(data, type, row, meta) {
          return `<div class="d-flex align-items-center">
            <div class="bg-primary rounded me-2" style="width: 35px; height: 35px;"></div>
            <div>${data}</div>
          </div>`;
        },
      },
      {
        data: 'column2',
        sortable: false,
        width: '15%',
      },
      {
        data: 'column3',
        sortable: false,
        width: '15%',
      },
      {
        data: 'column4',
        sortable: false,
        width: '15%',
      },
      {
        data: 'column5',
        sortable: false,
        width: '15%',
      },
    ],
    dom:
      `<'row'
        <'col-sm-12'tr>
      >
      <'row mt-2 mb-3'
        <'col-sm-12 col-md-2 _border'>
        <'col-sm-12 col-md-8 _border'
          <'text-center'p>
        >
        <'col-sm-12 col-md-2 pe-2 _border'
          <'h-100 d-flex align-items-center justify-content-end me-2'l>
        >
      >`,
    // dom: 'rt<"bottom"lp><"clear">',
  });

  test_simple = $DataTable_Simple;
  dt_simple = $DataTable_Simple.dataTable;

  $DataTable_Simple.updateData(data);

  $('#btn_simple_getselectedrowdatas').on('click', function(e) {
    console.log($DataTable_Simple.getSelectedRowDatas());
  });

  $('#btn_simple_getselectedrowids').on('click', function(e) {
    console.log($DataTable_Simple.getSelectedRowIds());
  });

  /**
    * ========== ========== ========== ========== ========== ==========
    *
    * Simple Layout - Draw Data
    */

  const $DataTable_DrawData = new EnhanceDataTable({
    id: '#DataTable_DrawData',
    show_row_number: false,
    // show_checkbox: true,
    enable_checkbox_event: true,
    autoWidth: false,
    order: [],
    //*/
    select: {
      // style: 'os',
      // selector: 'td, th',
      style: 'multiple',
      selector: 'td:first-child  input[type="checkbox"]'
    },
    //*/
    language: {
      lengthMenu: 'Items per page _MENU_',
      paginate: {
        previous: '<i class="fa-solid fa-arrow-left"></i>',
        next    : '<i class="fa-solid fa-arrow-right"></i>',
      }
    },
    columns: [
      {
        searchable: false,
        orderable : false,
        sortable  : false,
        width     : 21,
      },
      {
        // data: 'column1',
        // // sortable: false,
        // render: function(data, type, row, meta) {
        //   return `<div class="d-flex align-items-center">
        //     <div class="bg-primary rounded me-2" style="width: 35px; height: 35px;"></div>
        //     <div>${data}</div>
        //   </div>`;
        // },
        width: 'auto',
      },
      {
        // data: 'column2',
        // sortable: false,
        width: '15%',
      },
      {
        // data: 'column3',
        // sortable: false,
        width: '15%',
      },
      {
        // data: 'column4',
        // sortable: false,
        width: '15%',
      },
      {
        // data: 'column5',
        // sortable: false,
        width: '15%',
      },
    ],
    dom:
      `<'row'
        <'col-sm-12'tr>
      >
      <'row mt-2 mb-3'
        <'col-sm-12 col-md-2 _border'>
        <'col-sm-12 col-md-8 _border'
          <'d-flex align-items-center justify-content-center'p>
        >
        <'col-sm-12 col-md-2 pe-2 _border'
          <'h-100 d-flex align-items-center justify-content-end me-2'l>
        >
      >`,
    // dom: 'rt<"bottom"lp><"clear">',
  });

  test_draw = $DataTable_DrawData;
  dt_draw = $DataTable_DrawData.dataTable;

  $('#btn_draw_getselectedrowdatas').on('click', function(e) {
    console.log($DataTable_DrawData.getSelectedRowDatas());
  });

  $('#btn_draw_getselectedrowids').on('click', function(e) {
    console.log($DataTable_DrawData.getSelectedRowIds());
  });

  /**
   * Render HTML template with data variables.
   *
   * @param {string} selector     DOM selector of the template element.
   * @param {object} data         Data to supply to the template.
   */
  const renderHtml = function (selector, data) {
    // Initialize template parser
    var render = TemplateSnippet($(selector).html());

    // Return rendered data
    return render(data);
  }

  let draw_today_date = moment().format('YYYY-MM-DD');

  for (let i = 0; i < 20; i++) {
    let id = i + 1;

    $DataTable_DrawData
      .dataTable
      .row
      .add($(renderHtml('#dt_row_template', {
        id: `data-id-${id}`,
        custom_date: draw_today_date,
      })))
      .draw();

    draw_today_date = moment(draw_today_date).add(1, 'days').format('YYYY-MM-DD');
  }

  /**
    * ========== ========== ========== ========== ========== ==========
    *
    * Scrollspy event
    */

  // $('[data-bs-spy="scroll"]').on('activate.bs.scrollspy', (e) => {
  //   console.log(e)
  // });

  /**
    * ========== ========== ========== ========== ========== ==========
    *
    * Ace Editor
    */

  const config_ace_javascript = {
    mode    : 'ace/mode/javascript',
    readOnly: true,
    maxLines: Infinity,
    fontSize: '11px',
  };

  // Property
  ace.edit('example_prop_buttons', config_ace_javascript);
  ace.edit('example_prop_column_hide_in_card', config_ace_javascript);
  ace.edit('example_prop_three_states_sort', config_ace_javascript);
  ace.edit('example_prop_show_row_number', config_ace_javascript);
  ace.edit('example_prop_show_checkbox', config_ace_javascript);
  ace.edit('example_prop_checked_visible_only', config_ace_javascript);

  // Method
  ace.edit('example_method_getAjaxUrl', config_ace_javascript);
  ace.edit('example_method_setAjaxUrl', config_ace_javascript);
  ace.edit('example_method_getView', config_ace_javascript);
  ace.edit('example_method_setView', config_ace_javascript);
  ace.edit('example_method_toggleView', config_ace_javascript);
  ace.edit('example_method_getRows', config_ace_javascript);
  ace.edit('example_method_getRowData', config_ace_javascript);
  ace.edit('example_method_getSelectedRowIds', config_ace_javascript);
  ace.edit('example_method_getSelectedRowDatas', config_ace_javascript);
  ace.edit('example_method_refresh', config_ace_javascript);
  ace.edit('example_method_on', config_ace_javascript);
  ace.edit('example_method_search', config_ace_javascript);
  ace.edit('example_method_updateData', config_ace_javascript);
  ace.edit('example_method_clearData', config_ace_javascript);
  ace.edit('example_method_resetOrder', config_ace_javascript);
  ace.edit('example_method_select', config_ace_javascript);
  ace.edit('example_method_deselect', config_ace_javascript);

  // Event
  ace.edit('example_event_toggleview', config_ace_javascript);

});

// ==================================================================

/* globals Chart:false, feather:false */

(() => {
  'use strict'

  // feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  const ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  /* const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  }) */
})()
