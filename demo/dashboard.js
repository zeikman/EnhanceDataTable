let test,
    dt,
    test_custom,
    dt_custom,
    test_simple,
    dt_simple,
    test_draw,
    dt_draw;

$(document).ready(function() {
  'use strict'

  // NOTE: test lodash merge - https://lodash.com/
  // https://datatables.net/examples/api/select_row.html
  // https://gist.github.com/sujeetkv/252480d39ae52e92c380b9317cea00b5

  const control = {
    sample_default: true,
    sample_custom: true,
    sample_simple: true,
    sample_draw: true,
  };

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

  /**
   * ========== ========== ========== ========== ========== ==========
   *
   * Default Layout
   */

  if (control.sample_default) {
    const $DataTable = new EnhanceDataTable({
      /**
       * EnhanceDataTable property
       */
      id: '#DataTable',
      show_checkbox: true,

      /**
       * DataTable original property
       */
      autoWidth: false,

      // no default sorting
      order: [],

      columns: [
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
    });

    /*/
    $DataTable
      .dataTable
      .rows
      .add(data)
      .draw();
    /*/
    $DataTable.updateData(data);
    //*/

    test = $DataTable;
    dt = $DataTable.dataTable;

    $('#btn_getselectedrowdatas').on('click', function(e) {
      console.log($DataTable.getSelectedRowDatas());
    });

    $('#btn_getselectedrowids').on('click', function(e) {
      console.log($DataTable.getSelectedRowIds());
    });

    $('#btn_getvisibleselectedrowdatas').on('click', function(e) {
      console.log($DataTable.getVisibleSelectedRowDatas());
    });

    $('#btn_getvisibleselectedrowids').on('click', function(e) {
      console.log($DataTable.getVisibleSelectedRowIds());
    });
  }

  /**
   * ========== ========== ========== ========== ========== ==========
   *
   * Custom Layout
   */

  if (control.sample_custom) {
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
          // visible: false,
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
          // visible: false,
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
        // 'copy',
        // 'pdf',
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
      ],
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

      for (let i = 0; i < getRandomInt(50, 100); i++) {
        updateData.push({
          // NOTE: must provide 'rowNumber' if 'show_row_number = true'
          rowNumber : '',
          checkbox  : false,
          id        : i + 1,
          column1   : `data ${getRandomArbitrary(0, 100)}`,
          column2   : today_date,
          column3   : `data ${getRandomArbitrary(0, 100)}`,
          column4   : `data ${getRandomArbitrary(0, 100)}`,
          column5   : `data ${getRandomArbitrary(0, 100)}`,
        });
      }

      $DataTable_Custom.updateData(updateData, false);
    });
  }

  /**
   * ========== ========== ========== ========== ========== ==========
   *
   * Simple Layout
   */

  if (control.sample_simple) {
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

    $('#btn_simple_getvisibleselectedrowdatas').on('click', function(e) {
      console.log($DataTable_Simple.getVisibleSelectedRowDatas());
    });

    $('#btn_simple_getvisibleselectedrowids').on('click', function(e) {
      console.log($DataTable_Simple.getVisibleSelectedRowIds());
    });
  }

  /**
   * ========== ========== ========== ========== ========== ==========
   *
   * Simple Layout - Draw Data
   */

  if (control.sample_draw) {
    const $DataTable_DrawData = new EnhanceDataTable({
      id: '#DataTable_DrawData',
      show_row_number: false,
      // show_checkbox: true,
      checked_visible_only: true,
      enable_checkbox_event: true,
      checkbox_header_class: '.my-checkbox-header',
      checkbox_class: '.my-checkbox',
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
          width: 'auto',
        },
        {
          width: '15%',
        },
        {
          width: '15%',
        },
        {
          width: '15%',
        },
        {
          width: '15%',
        },
      ],
      dom:
        `<'row d-none'
          <'col-sm-12'B>
        >
        <'row'
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

    document.getElementById('input_draw_search').addEventListener('search', function (e) {
      $DataTable_DrawData.search(this.value.trim());
    });

    $('#btn_draw_Export').on('click', 'a', function(e) {
      e.preventDefault();

      const buttonIndex = $(this).attr('href').slice(1);

      $DataTable_DrawData.dataTable.button(buttonIndex).trigger()
    });

    $('#btn_draw_toggleview').on('click', function(e) {
      $DataTable_DrawData.toggleView();
    });

    $('#btn_draw_getselectedrowdatas').on('click', function(e) {
      console.log($DataTable_DrawData.getSelectedRowDatas());
    });

    $('#btn_draw_getselectedrowids').on('click', function(e) {
      console.log($DataTable_DrawData.getSelectedRowIds());
    });

    $('#btn_draw_getvisibleselectedrowdatas').on('click', function(e) {
      console.log($DataTable_DrawData.getVisibleSelectedRowDatas());
    });

    $('#btn_draw_getvisibleselectedrowids').on('click', function(e) {
      console.log($DataTable_DrawData.getVisibleSelectedRowIds());
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

    if ($DataTable_DrawData.hasOwnProperty('dataTable')) {
      let draw_today_date = moment().format('YYYY-MM-DD');

      // rows.add()
      let template_array = [];

      for (let i = 0; i < 1000; i++) {
        let id = i + 1;

        const template = $(renderHtml('#dt_row_template', {
          id: `data-id-${id}`,
          custom_date: draw_today_date,
        }));
        // console.log(template)

        template_array.push(template[0]);

        draw_today_date = moment(draw_today_date).add(1, 'days').format('YYYY-MM-DD');
      }

      /*/
      $DataTable_DrawData
        .dataTable
        .rows
        .add(template_array)
        .draw();
      /*/
      $DataTable_DrawData.updateData(template_array);
      //*/
    }
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

  // Sample
  ace.edit('sample_default_layout', config_ace_javascript);
  ace.edit('sample_custom_layout_bootstrap5', config_ace_javascript);
  ace.edit('sample_simple_layout_bootstrap5', config_ace_javascript);
  ace.edit('sample_simple_layout_draw_snippet', config_ace_javascript);

  // Property
  ace.edit('example_prop_buttons', config_ace_javascript);
  ace.edit('example_prop_column_hide_in_card', config_ace_javascript);
  ace.edit('example_prop_three_states_sort', config_ace_javascript);
  ace.edit('example_prop_show_row_number', config_ace_javascript);
  ace.edit('example_prop_show_checkbox', config_ace_javascript);
  ace.edit('example_prop_checked_visible_only', config_ace_javascript);
  ace.edit('example_prop_enable_checkbox_event', config_ace_javascript);
  ace.edit('example_prop_checkbox_header_class', config_ace_javascript);
  ace.edit('example_prop_checkbox_class', config_ace_javascript);

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
  ace.edit('example_method_getVisibleSelectedRowIds', config_ace_javascript);
  ace.edit('example_method_getVisibleSelectedRowDatas', config_ace_javascript);
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