/** Custom button - reload */
$.fn.dataTable.ext.buttons.reload = {
  // text      : '<i class="fa-solid fa-sync"></i>',
  text      : 'Reload Data',
  titleAttr : 'Reload Data',
  className : 'buttons-reload',
  action: function (e, dt, node, config)
  {
    if (dt.ajax.url())
    {
      this.ajax.reload();
    }
    else
    {
      if (dt.rows().data().length)
      {
        this.order.neutral().draw();
      }
    }
  }
};

/** Custom button - reload */
$.fn.dataTable.ext.buttons.cardview = {
  // text:
  //   `<i class="fa-solid fa-table"></i>
  //   <i class="fa-solid fa-arrows-h fa-fw"></i>
  //   <i class="fa-solid fa-id-card"></i>`,
  text      : 'Toggle View',
  titleAttr : 'Toggle View',
  className : 'buttons-cardview',
  action: function (e, dt, node, config)
  {
    const tableNodeId         = `#${dt.table().node().id}`;
    const wrapperNodeId       = `${tableNodeId}_wrapper`;
    const column_hide_in_card = $(dt.table().node()).data('card-hide-col');
    const $dt                 = $(tableNodeId);

    // hide in card view, but can re-open using column toggle
    const toggle_columns_visibility =
      column_hide_in_card && typeof column_hide_in_card === 'object'
        ? column_hide_in_card
        : [];

    let show_toggle_columns = false;
    let hide_toggle_columns = false;

    if ($(wrapperNodeId).hasClass('dt-card'))
    {
      // when turn into table view
      if (toggle_columns_visibility.length > 0)
      {
        show_toggle_columns = true;
      }

      $(`${wrapperNodeId} .cardview-col-header`).remove();
    }
    else
    {
      // when turn into card view
      const theadRows = $(`${tableNodeId} thead tr`);
      let labels = [];

      if (theadRows.length == 1)
      {
        $(`${tableNodeId} thead th`).each(function ()
        {
          labels.push($(this).text());
        });
      }

      if (theadRows.length == 2)
      {
        let row_1 = [];
        let row_2 = [];
        let row_result = [];

        theadRows.each((index, tr) => {
          if (index == 0)
          {
            $(tr).children().each((cIndex, th) => row_1.push(th));
          }

          if (index == 1)
          {
            $(tr).children().each((cIndex, th) => row_2.push(th));
          }
        });

        row_1.forEach((th, index) => {
          const colspan = $(th).attr('colspan');

          if (colspan == 1)
          {
            row_result.push($(th).text());
          }
          else
          {
            for (let i = 0; i < colspan; i++)
            {
              const row_2_th = row_2.shift();

              row_result.push($(row_2_th).text());
            }
          }
        });

        labels = row_result;
      }

      $(`${tableNodeId} tbody tr`).each(function ()
      {
        $(this)
          .find('td')
          .each(function (column)
          {
            // console.log('cardview-col-header > DEBUG-2'); // DEBUG
            $(`<label class='cardview-col-header'>${labels[column]}</label>`).prependTo($(this));
          });
      });

      if (toggle_columns_visibility.length > 0)
      {
        hide_toggle_columns = true;
      }
    }

    $(wrapperNodeId).toggleClass('dt-card');

    $dt.data('view-status', $(wrapperNodeId).hasClass('dt-card')
      ? 'card'
      : 'table');

    if ($(wrapperNodeId).hasClass('dt-card'))
    {
      $(wrapperNodeId).addClass('card-view');
      $(wrapperNodeId).removeClass('table-view');
    }
    else
    {
      $(wrapperNodeId).addClass('table-view');
      $(wrapperNodeId).removeClass('card-view');
    }

    if (show_toggle_columns)
    {
      dt.columns(toggle_columns_visibility)
        .visible(true);

      $(`${wrapperNodeId} .cardview-col-header`).remove();
    }

    if (hide_toggle_columns)
    {
      dt.columns(toggle_columns_visibility)
        .visible(false);
    }

    // Emit toggle table-card event
    const toggleView = new CustomEvent('toggleView', {
      detail: {
        view: $dt.data('view-status'),
      },
    });

    dt.table()
      .node()
      .dispatchEvent(toggleView);
  }
};

/** En enhanced version of jQuery DataTable with various useful built-in methods and functionalities. */
class EnhanceDataTable
{
  /*/
  #_debug = true;
  /*/
  #_debug = false;
  //*/

  // NOTE: Static Methods ========== ========== ========== ========== ========== ========== ========== ==========

  // NOTE: Private Properties ========== ========== ========== ========== ========== ========== ========== ==========

  /** @private */
  #_datatable;

  /** @private */
  #_id;

  /** @private */
  #_checkbox_header_triggered;

  /** @private */
  #_default_thead;

  /** @private */
  #_default_checkbox_column_header_class = '.column-checkbox-header';

  /** @private */
  #_default_checkbox_column_class = '.column-checkbox';

  /** @private */
  #_default_rowreorder_column_header_class = '.column-rowReorder-header';

  /** @private */
  #_default_rowreorder_column_class = '.column-rowReorder';

  /** @private */
  #_current_page = 0;

  /**
   * Default properties
   *
   * @private
   */
  #_props = {
    // EnhanceDataTable properties
    column_hide_in_card   : [],
    three_states_sort     : true,
    show_row_number       : true,
    show_row_reorder      : false,
    show_checkbox         : false,
    checked_visible_only  : false,
    enable_checkbox_event : false,
    sticky_header         : false,

    // DataTable original properties //

    // enable ENTER search
    search: {
      return: true,
    },
    // searchDelay: 500,

    // language config
    language: {
      search            : '', // '_INPUT_', // 'Search:'
      searchPlaceholder : 'ENTER Search; ESC Clear',
      // info              : 'Showing _START_ to _END_ of _TOTAL_ rows', // 'Showing _START_ to _END_ of _TOTAL_ entries'
      // infoFiltered      : '',                                         // '(filtered from _MAX_ total entries)'
      // lengthMenu        : '_MENU_ rows per page',                     // 'Show _MENU_ entries'
      // paginate: {
      //   previous: '<i class="fas fa-chevron-left"></i>',
      //   next    : '<i class="fas fa-chevron-right"></i>',
      // }
    },

    // custom layout structure
    /*/
    dom: `<'row top-paging'<'col-sm-5'<'dataTables_paging_info'il>><'col-sm-7'p>>
          <'row'<'col-sm-6'<'dataTables-custom-search'f>><'col-sm-6'<'dt_cv-row'B>>>
          <'row'<'col-sm-12'tr>>
          <'row'<'col-sm-5'<'dataTables_paging_info'il>><'col-sm-7'p>>`,
    //*/

    // Bootstrap 5 default
    /*/
    dom: `<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>
          <'row'<'col-sm-12'tr>>
          <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>`,
    //*/

  };

  /**
   * Init DataTable.
   *
   * @private
   */
  #_initDataTable()
  {
    let proceed_init = this.#_setupCheckboxClasses();

    if (proceed_init)
    {
      proceed_init = this.#_setupRowReorderClasses();
    }

    if (!proceed_init)
    {
      return proceed_init;
    }

    if (this.#_debug)
    {
      console.error(`init : ${this.#_id}`);
    }

    this.#_retainDefaultTheadStructure();
    this.#_setupRowCallback();
    this.#_setupDrawCallback();
    this.#_setupInitComplete();
    this.#_setupCheckboxColumn();   // column sequence - 3
    this.#_setupRowReorderColumn(); // column sequence - 2
    this.#_setupRowNumber();        // column sequence - 1

    // setup default DataTableNode[data-]
    $(this.#_id).data('view-status', 'table');

    if (this.#_props.hasOwnProperty('column_hide_in_card'))
    {
      $(this.#_id).data('card-hide-col', this.#_props.column_hide_in_card);
    }

    const datatable_id = this.#_id;

    if ($(datatable_id).length > 0)
    {
      const props   = this.#_props;
      const wrapper = `${datatable_id}_wrapper`;

      this.#_datatable = $(datatable_id).DataTable(props);

      // Gets DataTable object.
      this.dataTable = this.#_datatable;

      $(wrapper).addClass('table-view');

      // Setup sticky header
      if (props.sticky_header)
      {
        $(`${wrapper} thead`).addClass('dt-sticky-header');
      }

      return true;
    }
    else
    {
      console.error(`[EnhanceDataTable] Error: DOM element '${datatable_id}' not found !`);

      window.alert(`[EnhanceDataTable] Error: DOM element '${datatable_id}' not found !`);

      return false;
    }
  }

  /**
   * Setup checkbox classes.
   */
  #_setupCheckboxClasses()
  {
    // setup default checkbox classes
    if (this.#_props.hasOwnProperty('checkbox_header_class'))
    {
      this.#_default_checkbox_column_header_class = this.#_props.checkbox_header_class;
    }

    if (this.#_props.hasOwnProperty('checkbox_class'))
    {
      this.#_default_checkbox_column_class = this.#_props.checkbox_class;
    }

    // check custom checkbox header element existency if not using built-in checkbox
    if (this.#_props.enable_checkbox_event)
    {
      const checkboxHeaderClass = this.#_default_checkbox_column_header_class;

      if ($(`${this.#_id} ${checkboxHeaderClass}`).length == 0)
      {
        console.error(`[EnhanceDataTable] Error: Checkbox header element '${this.#_id} ${checkboxHeaderClass}' not found !`);

        window.alert(`[EnhanceDataTable] Error: Checkbox header element '${this.#_id} ${checkboxHeaderClass}' not found !`);

        return false;
      }
    }

    return true;
  }

  /**
   * Setup rowReorder classes.
   */
  #_setupRowReorderClasses()
  {
    // setup default rowReorder classes
    if (this.#_props.hasOwnProperty('rowreorder_header_class'))
    {
      //
    }

    // check custom rowReorder header element existency if not using built-in checkbox
    if (this.#_props.hasOwnProperty('rowreorder_class'))
    {
      //
    }

    return true;
  }

  /**
   * Retain original thead structure.
   *
   * @private
   */
  #_retainDefaultTheadStructure()
  {
    this.#_default_thead = $(`${this.#_id} thead`).clone();
  }

  /**
   *  Deep clone object.
   *
   * @param {Object}  src     Source object.
   * @param {String}  method  Clone method.
   * @returns
   */
  #_cloneObject(src, method = 'jquery')
  {
    switch (method)
    {
      case 'jsoncopy':
        return JSON.parse(JSON.stringify(src));

      case 'objectassign':
        return Object.assign({}, src);

      case 'iteration':
        let target = {};

        for (let prop in src)
        {
          if (src.hasOwnProperty(prop))
          {
            target[prop] = src[prop];
          }
        }
        return target;

      default: // jquery - deep copy
        return $.extend(true, {}, src);
    }
  }

  /**
   * Setup internal rowCallback.
   *
   * @private
   */
  #_setupRowCallback()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    let userDefinedRowCallback = function () {};

    // store user defined rowCallback
    if (this.#_props.rowCallback && typeof this.#_props.rowCallback === 'function')
    {
      userDefinedRowCallback = this.#_props.rowCallback;

      delete this.#_props.rowCallback;
    }

    this.#_props.rowCallback = function (row, data, displayNum, displayIndex, dataIndex)
    {
      // handle reload content during card view
      if ($(wrapper).hasClass('dt-card'))
      {
        const labels = self.#_getColumnWithoutColspan();

        $('td', row).each(function (column, td)
        {
          if ($(td).find('label').length == 0)
          {
            // console.log('cardview-col-header > DEBUG-1'); // DEBUG
            $(`<label class='cardview-col-header'>${labels[column]}</label>`).prependTo($(this));
          }
        });
      }

      // handle checkbox render
      if (self.#_props.show_checkbox || self.#_props.enable_checkbox_event)
      {
        if (Array.isArray(data))
        {
          /*/
          if (self.#_debug)
          {
            console.warn('draw() type data >>> handle checkbox render');
          }
          //*/

          // support data insertion using row.add().draw()
          if (self.#_props.checked_visible_only)
          {
            //
          }
          else
          {
            const checkboxHeaderClass           = self.#_default_checkbox_column_header_class;
            const isCheckboxHeaderChecked       = $(`${self.#_id} ${checkboxHeaderClass} input[type="checkbox"]`).is(':checked');
            const isCheckboxHeaderIndeterminate = $(`${self.#_id} ${checkboxHeaderClass} input[type="checkbox"]`).is(':indeterminate');

            if (isCheckboxHeaderChecked)
            {
              $('input[type="checkbox"]', row).prop('checked', true);
            }
            else
            {
              if (!isCheckboxHeaderIndeterminate)
              {
                $('input[type="checkbox"]', row).prop('checked', false);
              }
            }
          }
        }
        else
        {
          /*/
          if (self.#_debug)
          {
            console.warn('object type data >>> handle checkbox render');
          }
          //*/

          $('input[type="checkbox"]', row).prop('checked', data.checkbox
            ? true
            : false);
        }
      }

      userDefinedRowCallback(row, data, displayNum, displayIndex, dataIndex);
    };
  }

  /**
   * Setup internal rowCallback
   *
   * @private
   */
  #_setupDrawCallback()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    let userDefinedDrawCallback = function () {};

    // store user defined drawCallback
    if (this.#_props.drawCallback && typeof this.#_props.drawCallback === 'function')
    {
      userDefinedDrawCallback = this.#_props.drawCallback;

      delete this.#_props.drawCallback;
    }

    this.#_props.drawCallback = function (settings)
    {
      if ($(self.#_id).data('view-status') == 'table')
      {
        $(`${wrapper} .cardview-col-header`).remove();
      }

      if (self.#_props.checked_visible_only)
      {
        // Handle 'page.dt' and 'length.dt' events
        if (self.#_debug)
        {
          console.warn(`drawCallback() update ${self.#_default_checkbox_column_header_class} >>> input[type="checkbox"] state`);
        }

        self.#_checkboxHeaderUpdateStatus();

        self.#_checkboxHeaderIndeterminate();
      }

      userDefinedDrawCallback(settings);
    }
  }

  /**
   * Get Array of column text without colspan.
   *
   * @returns Array of column text.
   */
  #_getColumnWithoutColspan(use_default_thead = false)
  {
    const self = this;

    // NOTE: maximum handle up to two rowspan
    let theadRows = $(`${this.#_id} thead tr`);
    let labels = [];

    if (use_default_thead)
    {
      theadRows = $(this.#_default_thead).find('tr');

      labels = this.#_combineColspanColumn(theadRows, [ '#' ], use_default_thead);
    }
    else
    {
      if (theadRows.length == 1)
      {
        $(`${self.#_id} thead th`).each(function ()
        {
          labels.push($(this).text());
        });
      }

      if (theadRows.length == 2)
      {
        labels = this.#_combineColspanColumn(theadRows);
      }
    }

    return labels;
  }

  /**
   * Combine colspan columns into one row.
   *
   * @param {Array} theadRows   thead tr in array.
   *
   * @returns {Array} Array of th element without colspan.
   */
  #_combineColspanColumn(theadRows, row_result = [], use_default_thead)
  {
    let row_1 = [];
    let row_2 = [];

    theadRows.each((index, tr) => {
      if (index == 0)
      {
        $(tr).children().each((cIndex, th) => row_1.push(th));
      }

      if (index == 1)
      {
        $(tr).children().each((cIndex, th) => row_2.push(th));
      }
    });

    if (use_default_thead)
    {
      row_1.forEach((th, index) => {
        const colspan = $(th).attr('colspan');

        if (colspan > 0)
        {
          for (let i = 0; i < colspan; i++)
          {
            const row_2_th = row_2.shift();

            row_result.push($(row_2_th).text());
          }
        }
        else
        {
          row_result.push($(th).text());
        }
      });
    }
    else
    {
      row_1.forEach((th, index) => {
        const colspan = $(th).attr('colspan');

        if (colspan == 1)
        {
          row_result.push($(th).text());
        }
        else
        {
          for (let i = 0; i < colspan; i++)
          {
            const row_2_th = row_2.shift();

            row_result.push($(row_2_th).text());
          }
        }
      });
    }

    return row_result;
  }

  /**
   * Setup internal initComplete.
   *
   * @private
   */
  #_setupInitComplete()
  {
    const self = this;

    let userDefinedInitComplete = function () {};

    // store user defined initComplete
    if (this.#_props.initComplete && typeof this.#_props.initComplete === 'function')
    {
      userDefinedInitComplete = this.#_props.initComplete;

      delete this.#_props.initComplete;
    }

    // internal must run initComplate > generate table-card view toggle
    this.#_props.initComplete = function (settings, json)
    {
      // Setup checkbox event
      if (self.#_props.show_checkbox || self.#_props.enable_checkbox_event)
      {
        self.#_setupCheckboxHeaderEvent(settings, json);
      }

      // Input search ESC-key event
      self.#_setupInputSearchEscEvent(settings, json);

      // run user defined initComplete
      userDefinedInitComplete(settings, json);
    };
  }

  /**
   * Toggle between table and card view.
   *
   * @private
   */
  #_toggleView()
  {
    const wrapper = `${this.#_id}_wrapper`;
    const column_hide_in_card = $(this.#_id).data('card-hide-col');

    // hide in card view, but can re-open using column toggle
    const toggle_columns_visibility =
      column_hide_in_card && typeof column_hide_in_card === 'object'
        ? column_hide_in_card
        : [];

    let show_toggle_columns = false;
    let hide_toggle_columns = false;

    if ($(wrapper).hasClass('dt-card'))
    {
      // when turn into table view
      if (toggle_columns_visibility.length > 0)
      {
        show_toggle_columns = true;
      }

      $(`${wrapper} .cardview-col-header`).remove();
    }
    else
    {
      // when turn into card view
      const labels = this.#_getColumnWithoutColspan();

      $(`${this.#_id} tbody tr`).each(function ()
      {
        $(this)
          .find('td')
          .each(function (column)
          {
            // console.log('cardview-col-header > DEBUG-2'); // DEBUG
            $(`<label class='cardview-col-header'>${labels[column]}</label>`).prependTo($(this));
          });
      });

      if (toggle_columns_visibility.length > 0)
      {
        hide_toggle_columns = true;
      }
    }

    $(wrapper).toggleClass('dt-card');

    $(this.#_id).data('view-status', $(wrapper).hasClass('dt-card')
      ? 'card'
      : 'table');

    if ($(wrapper).hasClass('dt-card'))
    {
      $(wrapper).addClass('card-view');
      $(wrapper).removeClass('table-view');
    }
    else
    {
      $(wrapper).addClass('table-view');
      $(wrapper).removeClass('card-view');
    }

    if (show_toggle_columns)
    {
      this.#_datatable
        .columns(toggle_columns_visibility)
        .visible(true);

      $(`${wrapper} .cardview-col-header`).remove();
    }

    if (hide_toggle_columns)
    {
      this.#_datatable
        .columns(toggle_columns_visibility)
        .visible(false);
    }

    // Emit toggle table-card event
    const toggleView = new CustomEvent('toggleView', {
      detail: {
        view: $(this.#_id).data('view-status'),
      },
    });

    this.#_datatable
      .table()
      .node()
      .dispatchEvent(toggleView);
  }

  #_setupCheckboxHeaderEvent(settings, json)
  {
    const self = this;

    // checkbox header event
    const checkboxHeaderClass = this.#_default_checkbox_column_header_class;

    $(this.#_id).on('click', `${checkboxHeaderClass} input[type="checkbox"]`, function (e)
    {
      if (self.#_debug)
      {
        console.warn(`click >>> ${self.#_default_checkbox_column_header_class} input[type="checkbox"]`);
      }

      self.#_checkbox_header_triggered = true;

      const checkboxClass = self.#_default_checkbox_column_class;
      const checkboxExist = $(`${self.#_id} ${checkboxClass}`).length > 0;

      if (checkboxExist)
      {
        // checked/unchecked on visible checkboxes only
        if (self.#_props.checked_visible_only)
        {
          const visible_checkbox  = $(`${self.#_id} tbody ${checkboxClass}:visible`);
          const info              = self.#_datatable.page.info();
          const page_number       = info.page;
          const page_length       = info.length;

          const visible_row_indexes = visible_checkbox.map((index, checkbox) => {
            return index + (page_number * page_length);
          });

          if (this.checked)
          {
            self.select(visible_row_indexes);
          }
          else
          {
            self.deselect(visible_row_indexes);
          }
        }
        // checked/unchecked on all checkboxes
        else {
          if (this.checked)
          {
            self.#_datatable.rows().select();
          }
          else
          {
            self.#_datatable.rows().deselect();
          }
        }
      }
      else
      {
        self.#_checkbox_header_triggered = false;

        console.error(`[EnhanceDataTable] Error: Checkbox element '${checkboxClass}' not found !`);

        window.alert(`[EnhanceDataTable] Error: Checkbox element '${checkboxClass}' not found !`);
      }
    });
  }

  /**
   * Setup input search ESC-key event.
   *
   * @private
   */
  #_setupInputSearchEscEvent(settings, json)
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    $(`${wrapper} .dataTables_filter input[type="search"]`).on('keyup', function (e)
    {
      if (self.#_debug)
      {
        console.warn('keyup >>> .dataTables_filter input[type="search"]');
      }

      // ESC to clear
      if (e.which == 27)
      {
        self.#_datatable
          .search('')
          .draw();
      }
    });
  }

  /**
   * Setup row number column.
   *
   * @private
   */
  #_setupRowNumber()
  {
    if (typeof this.#_props.show_row_number === 'boolean' && this.#_props.show_row_number)
    {
      const hasIndexColumn = this.#_props.columns.find((column) => column.data == 'rowNumber');

      if (!hasIndexColumn)
      {
        // Find maximum rowspan
        let maxRowSpan = 1;

        $(`${this.#_id} thead th`).each((index, th) => {
          const thRowSpan = $(th).attr('rowspan');

          if (thRowSpan > maxRowSpan)
          {
            maxRowSpan = thRowSpan;
          }
        });

        // Auto append row number DOM
        const indexColumn = `<th rowspan="${maxRowSpan}" class="column-row-number">#</th>`;

        $(`${this.#_id} thead tr:first-child`).prepend($(indexColumn));

        if ($(`${this.#_id} tfoot tr:first-child`).length > 0)
        {
          $(`${this.#_id} tfoot tr:first-child`).prepend($(indexColumn));
        }

        // Auto append row number column data
        this.#_props.columns.unshift({
          data      : 'rowNumber',
          searchable: false,
          orderable : false,
          sortable  : false,
          className : 'column-row-number',
          width     : 30,
        });
      }
    }
  }

  /**
   * Setup checkbox column.
   *
   * @private
   */
  #_setupCheckboxColumn()
  {
    if (typeof this.#_props.show_checkbox === 'boolean' && this.#_props.show_checkbox)
    {
      const hasCheckboxColumn = this.#_props.columns.find((column) => column.data == 'checkbox');

      if (!hasCheckboxColumn)
      {
        // Find maximum rowspan
        let maxRowSpan = 1;

        $(`${this.#_id} thead th`).each((index, th) => {
          const thRowSpan = $(th).attr('rowspan');

          if (thRowSpan > maxRowSpan)
          {
            maxRowSpan = thRowSpan;
          }
        });

        // Auto append checkbox DOM
        const checkbox_header_class = this.#_default_checkbox_column_header_class[0] == '.'
          ? this.#_default_checkbox_column_header_class.slice(1)
          : this.#_default_checkbox_column_header_class;

        const checkboxColumn = `<th rowspan="${maxRowSpan}" class="${checkbox_header_class} dt-center">
          <input type="checkbox" class="form-check-input" />
        </th>`;

        const checkboxColumnElement = $(checkboxColumn);

        $(`${this.#_id} thead tr:first-child`).prepend(checkboxColumnElement);

        // Auto append checkbox column data
        const checkbox_class = this.#_default_checkbox_column_class[0] == '.'
          ? this.#_default_checkbox_column_class.slice(1)
          : this.#_default_checkbox_column_class;

        this.#_props.columns.unshift({
          data      : 'checkbox',
          searchable: false,
          orderable : false,
          sortable  : false,
          className : 'dt-center',
          width     : 21,
          render    : function (data, type, row, meta)
          {
            return `<input type="checkbox" class="form-check-input ${checkbox_class}" />`;
          }
        });
      }

      // Config 'select' property
      const showRowNumber = this.#_props.show_row_number;
      const showRowReorder = this.#_props.show_row_reorder;

      let default_select_prop = {
        style: 'multiple', // api | single | multi | os | multi-shift
      };

      if (showRowNumber && showRowReorder)
      {
        default_select_prop.selector = 'td:nth-child(3) input[type="checkbox"]';
      }
      else
      {
        if (showRowNumber)
        {
          default_select_prop.selector = 'td:nth-child(2) input[type="checkbox"]';
        }
        else
        {
          default_select_prop.selector = 'td:first-child input[type="checkbox"]';
        }
      }

      const hasSelectProperty = this.#_props.hasOwnProperty('select');

      if (hasSelectProperty)
      {
        this.#_props.select = _.merge(
          default_select_prop,
          this.#_props.select
        );
      }
      else
      {
        this.#_props.select = default_select_prop;
      }

    }
  }

  #_setupRowReorderColumn()
  {
    if (typeof this.#_props.show_row_reorder === 'boolean' && this.#_props.show_row_reorder)
    {
      const hasRowReorderColumn = this.#_props.columns.find((column) => column.data == 'rowReorder');

      if (!hasRowReorderColumn)
      {
        // Find maximum rowspan
        let maxRowSpan = 1;

        $(`${this.#_id} thead th`).each((index, th) => {
          const thRowSpan = $(th).attr('rowspan');

          if (thRowSpan > maxRowSpan)
          {
            maxRowSpan = thRowSpan;
          }
        });

        // Auto append rowReorder DOM
        const rowReorder_header_class = this.#_default_rowreorder_column_header_class[0] == '.'
          ? this.#_default_rowreorder_column_header_class.slice(1)
          : this.#_default_rowreorder_column_header_class;

        const rowReorderColumn = `<th rowspan="${maxRowSpan}" class="${rowReorder_header_class} dt-center"></th>`;

        const rowReorderColumnElement = $(rowReorderColumn);

        $(`${this.#_id} thead tr:first-child`).prepend(rowReorderColumnElement);

        // Auto append checkbox column data
        const rowReorder_class = this.#_default_rowreorder_column_class[0] == '.'
          ? this.#_default_rowreorder_column_class.slice(1)
          : this.#_default_rowreorder_column_class;

        this.#_props.columns.unshift({
          data      : 'rowReorder',
          searchable: false,
          orderable : true,
          sortable  : false,
          className : `dt-center reorder ${rowReorder_class}`,
          width     : 20,
          render    : function (data, type, row, meta)
          {
            return `≡`;
          }
        });

        // Config 'rowReorder' property
        const rowReorder = this.#_props.rowReorder;

        let default_rowReorder_prop = {
          selector: 'td.reorder',
          // dataSrc : '.column-row-number',
          update  : false,
        };

        if (typeof rowReorder === 'boolean')
        {
          this.#_props.rowReorder = default_rowReorder_prop;
        }
        else
        {
          this.#_props.rowReorder = _.merge(
            default_rowReorder_prop,
            this.#_props.rowReorder
          );
        }
      }
    }
  }

  #_rowReorderEvent()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    // https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    this.#_datatable.on('row-reorder', function (e, diff, edit)
    {
      if (self.#_debug)
      {
        console.warn('datatable >>> row-reorder');
      }

      // store old data
      const temp_data_arr = {};

      diff.forEach(info => temp_data_arr[info.oldPosition] = self.#_datatable.row(info.oldPosition).data());

      // update to new data
      diff.forEach(info => self.#_datatable.row(info.newPosition).data(temp_data_arr[info.oldPosition]));

      self.#_datatable.draw();
    });
  }

  /**
   * Render row index.
   *
   * @private
   *
   * @see [counter_columns]{@link https://datatables.net/examples/api/counter_columns.html} - https://datatables.net/examples/api/counter_columns.html
   */
  #_renderRowNumber()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    let i = 1;

    this.#_datatable.cells(null, 0, { search: 'applied', order: 'applied' }).every(function (cell)
    {
      // handle reload during card view
      if ($(wrapper).hasClass('dt-card'))
      {
        const first_column_text = $(`${self.#_id} thead th:first`).text();

        // console.log('cardview-col-header > DEBUG-3'); // DEBUG
        this.data(`<label class='cardview-col-header'>${first_column_text}</label>${(i++).toString()}`);
      }
      else
      {
        this.data(i++);
      }
    });
  }

  /**
   * Column order event.
   */
  #_renderRowNumberEvent()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    this.#_datatable.on('order.dt search.dt', function (e)
    {
      if (self.#_debug)
      {
        console.warn('datatable >>> order.dt search.dt');
      }

      if (self.#_props.show_row_number)
      {
        if (self.#_debug)
        {
          console.warn('datatable >>> order.dt search.dt >>> show_row_number');
        }

        self.#_renderRowNumber();
      }

      // three_states_sort
      if (self.#_props.three_states_sort)
      {
        if (self.#_debug)
        {
          console.warn('datatable >>> order.dt search.dt >>> three_states_sort');
        }

        if (e.type == 'order')
        {
          /**
           * 3 states sort : asc | desc | no_sort
           *  https://stackoverflow.com/a/43125208/4679429
           */
          if (self.#_datatable.settings().order().length == 1)
          {
            const visibleColumns = self.#_datatable.settings().columns().visible();
            const columnMapping = {};
            let countMapping = 0;

            visibleColumns.each((visibility, index) => {
              if (visibility)
              {
                columnMapping[index] = countMapping++;
              }
            });

            let order = self.#_datatable.settings().order()[0];
            let th = $(`${self.#_id} th:eq(${columnMapping[order[0]]})`);

            if (th.attr('data-sort-next') === 'false')
            {
              /**
               * restore order
               *  https://datatables.net/plug-ins/api/order.neutral()
               */
              self.resetOrder();

              th.attr('data-sort-next', null);
            }
            else
            {
              th.attr('data-sort-next', order[1] === 'desc'
                ? false
                : true);
            }
          }
        }
      } // end of three_states_sort
    });
  }

  /**
   * Card view column header control
   */
  #_columnVisibilityEvent()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    this.#_datatable.on('column-visibility.dt', function (e, settings, column, state)
    {
      if (self.#_debug)
      {
        console.warn('datatable >>> column-visibility.dt');
      }

      if ($(wrapper).hasClass('dt-card'))
      {
        if (state)
        {
          /* self.#_datatable.rows().every(function (rowIdx, tableLoop, rowLoop)
          {
            const rowNode = this.node();

            $(rowNode).find('td').each();
          }); */

          // DEBUG
          var run = false;
          run = true;

          if (run)
          {
            self.#_datatable.cells(null, column).every(function (cell)
            {
              // add 'cardview-col-header' if not exist
              if ($(this.node()).find('.cardview-col-header').length == 0)
              {
                let original_content = this.data() == null || this.data() == undefined
                  ? ''
                  : this.data();

                let nth_column_text = $(`${self.#_id} thead th:nth-child(${column})`).text();

                // NOTE: maximum handle up to two rowspan
                const theadRows = $(`${self.#_id} thead tr`);

                if (theadRows.length == 2)
                {
                  const labels = self.#_getColumnWithoutColspan(true/* use_default_thead */);

                  nth_column_text = labels[column];
                  // console.log(labels);
                  // console.log(column);
                }

                if (nth_column_text == undefined)
                {
                  nth_column_text = 'Error Column';
                }

                /*/
                // console.log('cardview-col-header > DEBUG-4'); // DEBUG
                let changedData = `<label class='cardview-col-header'>${nth_column_text}</label>${original_content}`;
                //*/

                let changedData = original_content;

                // do not perform data changing when data type is not string
                if (typeof this.data() === 'object')
                {
                  changedData = this.data();
                }
                else
                {
                  const original_content_text = original_content.toString();

                  if (original_content_text.indexOf('cardview-col-header') == -1)
                  {
                    // console.log('cardview-col-header > DEBUG-4'); // DEBUG
                    changedData = `<label class='cardview-col-header'>${nth_column_text}</label>${original_content}`;
                  }
                }

                /*/
                // console.log(this.column().visible());
                // console.log(this.data());
                console.log(column);
                console.log(nth_column_text);
                // console.log(original_content);
                //*/

                this.data(changedData);
              }
            });
          }
        }
      }
      else
      {
        if (state)
        {
          const cardviewColHeader =  $(`${wrapper} .cardview-col-header`);

          if (cardviewColHeader.length > 0)
          {
            cardviewColHeader.remove();
          }
        }
      }
    });
  }

  /**
   * Select/Select-to-Checkbox internal event
   */
  #_selectDeselectEvent()
  {
    if (this.#_props.show_checkbox || this.#_props.enable_checkbox_event)
    {
      const self = this;

      this.#_datatable.on('select', function (e, dt, type, indexes)
      {
        if (self.#_debug)
        {
          console.warn('datatable >>> select');
        }

        // update data
        const checkbox_column = self.#_props.show_row_number
          ? 1
          : 0;

        indexes.forEach((rowIndex, index) => {
          const currentData = dt.cell(rowIndex, checkbox_column).data();

          if (currentData.toString() == 'true' || currentData.toString() == 'false')
          {
            dt.cell(rowIndex, checkbox_column).data(true);
          }
        });

        // update DOM checkbox
        const checkboxClass = self.#_default_checkbox_column_class;

        if (self.#_checkbox_header_triggered)
        {
          if (self.#_debug)
          {
            console.warn('#_checkbox_header_triggered >>> update DOM checkbox');
          }

          $(`${self.#_id} tbody ${checkboxClass}:visible`).prop('checked', true);
        }
        else
        {
          if (self.#_debug)
          {
            console.warn('row_checkbox_triggered >>> update DOM checkbox');
          }

          const pageInfo    = self.#_datatable.page.info();
          const pageLength  = pageInfo.length;
          const rowStart    = pageInfo.start;
          const rowEnd      = pageInfo.end;

          indexes.forEach((rowIndex, index) => {
            if (rowStart <= rowIndex && rowIndex <= (rowEnd - 1))
            {
              const domRowIndex = rowIndex % pageLength;

              $(`${self.#_id} tbody tr:eq(${domRowIndex}) td ${checkboxClass}`).attr('checked', true);
            }
          });
        }

        // update header checkbox
        if (!self.#_checkbox_header_triggered)
        {
          self.#_checkboxHeaderUpdateStatus();

          self.#_checkboxHeaderIndeterminate();
        }

        self.#_checkbox_header_triggered = false;
      });

      this.#_datatable.on('deselect', function (e, dt, type, indexes)
      {
        if (self.#_debug)
        {
          console.warn('datatable >>> deselect');
        }

        // update data
        const checkbox_column = self.#_props.show_row_number
          ? 1
          : 0;

        indexes.forEach((rowIndex, index) => {
          const currentData = dt.cell(rowIndex, checkbox_column).data();

          if (currentData.toString() == 'true' || currentData.toString() == 'false')
          {
            dt.cell(rowIndex, checkbox_column).data(false)
          }
        });

        // update DOM checkbox
        const checkboxClass = self.#_default_checkbox_column_class;

        if (self.#_checkbox_header_triggered)
        {
          if (self.#_debug)
          {
            console.warn('#_checkbox_header_triggered >>> update DOM checkbox');
          }

          $(`${self.#_id} tbody ${checkboxClass}:visible`).prop('checked', false);
        }
        else
        {
          if (self.#_debug)
          {
            console.warn('row_checkbox_triggered >>> update DOM checkbox');
          }

          const pageInfo    = self.#_datatable.page.info();
          const pageLength  = pageInfo.length;
          const rowStart    = pageInfo.start;
          const rowEnd      = pageInfo.end;

          indexes.forEach((rowIndex, index) => {
            if (rowStart <= rowIndex && rowIndex <= (rowEnd - 1))
            {
              const domRowIndex = rowIndex % pageLength;

              $(`${self.#_id} tbody tr:eq(${domRowIndex}) td ${checkboxClass}`).attr('checked', false);
            }
          });
        }

        // update header checkbox
        if (!self.#_checkbox_header_triggered)
        {
          self.#_checkboxHeaderUpdateStatus();

          self.#_checkboxHeaderIndeterminate();
        }

        self.#_checkbox_header_triggered = false;
      });
    }
  }

  /**
   * Checkbox header 'Indeterminate' control
   *
   * @param {Number|String} checkTotalRows Total rows.
   *
   * @returns {Boolean} Return true when indeterminate.
   */
  #_checkboxHeaderIndeterminate(checkTotalRows)
  {
    if (this.#_debug)
    {
      console.warn('#_checkboxHeaderIndeterminate');
    }

    if (!this.#_datatable)
    {
      return;
    }

    let totalRows = this.#_datatable.data().length;
    let selectedRows = this.#_datatable.rows('.selected').data().length;

    // checked/unchecked on visible checkboxes only
    if (this.#_props.checked_visible_only)
    {
      const checkboxClass = this.#_default_checkbox_column_class;

      totalRows = $(`${this.#_id} tbody ${checkboxClass}:visible`).length;
      selectedRows = $(`${this.#_id} tbody ${checkboxClass}:visible:checked`).length;
    }
    // checked/unchecked on all checkboxes
    else {
      //
    }

    if (checkTotalRows > 0)
    {
      totalRows = checkTotalRows;
    }

    if (this.#_debug)
    {
      console.log(`totalRows : ${totalRows}`);
      console.log(`selectedRows : ${selectedRows}`);
    }

    const checkboxHeaderClass = this.#_default_checkbox_column_header_class;
    const indeterminate = (selectedRows == 0 || selectedRows == totalRows)
      ? false
      : true;

    $(`${this.#_id} ${checkboxHeaderClass} input[type="checkbox"]`)
      .prop(
        'indeterminate',
        indeterminate
      );

    return indeterminate;
  }

  /**
   * Checkbox header checked/unchecked status control
   *
   * @param {Number|String} checkTotalRows Total rows.
   *
   * @returns {Boolean} Return true when checked.
   */
  #_checkboxHeaderUpdateStatus(checkTotalRows)
  {
    if (this.#_debug)
    {
      console.warn('#_checkboxHeaderUpdateStatus');
    }

    if (!this.#_datatable)
    {
      return;
    }

    let totalRows = this.#_datatable.data().length;
    let selectedRows = this.#_datatable.rows('.selected').data().length;

    // checked/unchecked on visible checkboxes only
    if (this.#_props.checked_visible_only)
    {
      const checkboxClass = this.#_default_checkbox_column_class;

      totalRows = $(`${this.#_id} tbody ${checkboxClass}:visible`).length;
      selectedRows = $(`${this.#_id} tbody ${checkboxClass}:visible:checked`).length;
    }
    // checked/unchecked on all checkboxes
    else {
      //
    }

    if (checkTotalRows > 0)
    {
      totalRows = checkTotalRows;
    }

    if (this.#_debug)
    {
      console.log(`totalRows : ${totalRows}`);
      console.log(`selectedRows : ${selectedRows}`);
    }

    const checkboxHeaderClass = this.#_default_checkbox_column_header_class;
    const checked = selectedRows == totalRows
      ? true
      : false;

    $(`${this.#_id} ${checkboxHeaderClass} input[type="checkbox"]`)
      .prop(
        'checked',
        checked
      );

    return checked;
  }

  // NOTE: Constructor ========== ========== ========== ========== ========== ========== ========== ==========

  constructor()
  {
    let args    = arguments[0];
    let args_1  = arguments[1];

    if (typeof args === 'object')
    {
      if (!args.id)
      {
        return console.error("[EnhanceDataTable] Error: Property 'id' is required !");
      }

      if (!args.columns)
      {
        return console.error("[EnhanceDataTable] Error: Property 'columns' is required !");
      }

      this.#_id = args.id;

      delete args.id;
    }

    // lodash - https://betterprogramming.pub/how-to-merge-deeply-nested-objects-in-javascript-27e12107480e
    this.#_props = _.merge(
      this.#_props,
      args
    );

    const init_success = this.#_initDataTable();

    if (init_success)
    {
      this.#_renderRowNumberEvent();
      this.#_columnVisibilityEvent();
      this.#_selectDeselectEvent();
      this.#_rowReorderEvent();
    }
  }
  // end of constructor

  // NOTE: Public Methods ========== ========== ========== ========== ========== ========== ========== ==========

  /**
   * Get DataTable ajax url.
   *
   * @returns {String} Ajax URL.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.getAjaxUrl();
   */
  getAjaxUrl()
  {
    return this.#_datatable.ajax.url();
  }

  /**
   * Set DataTable ajax url.
   *
   * @param {String}    url         Ajax URL.
   * @param {Boolean}   autoRefresh If True, ajax will reload after URL updated.
   * @param {Function}  callback    Function which is executed when the data has been reloaded and the table fully redrawn.
   * @param {Boolean}   resetPaging Reset or hold the current paging position.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.setAjaxUrl(string_new_ajax_url);
   *
   * @see [ajax.url()]{@link https://datatables.net/reference/api/ajax.url()} - https://datatables.net/reference/api/ajax.url()
   * @see [ajax.url().reload()]{@link https://datatables.net/reference/api/ajax.url().load()} - https://datatables.net/reference/api/ajax.url().load()
   */
  setAjaxUrl(url, autoRefresh = true, callback = null, resetPaging = true)
  {
    const hasAjax = this.#_props.ajax
      ? true
      : false;

    if (hasAjax)
    {
      if (autoRefresh)
      {
        this.#_datatable.ajax.url(url).load(callback, resetPaging);
      }
      else
      {
        this.#_datatable.ajax.url(url);
      }
    }
  }

  /**
   * Get DataTable view.
   *
   * @returns {String} DataTable current view.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.getView();
   */
  getView()
  {
    return $(this.#_id).data('view-status');
  }

  /**
   * Set DataTable view.
   *
   * @param {String} view   DataTable view
   *
   * @returns {Boolean} Return true when view toggle.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.setView('card');
   */
  setView(view = 'table')
  {
    if (
      (
        view == 'table'
        || view == 'card'
      )
      && $(this.#_id).data('view-status') != view
    )
    {
      this.toggleView();

      return true;
    }

    return false;
  }

  /**
   * Toggle DataTable view.
   *
   * @returns {Object} Object of previous and current view.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.toggleView();
   */
  toggleView()
  {
    const previousView = $(this.#_id).data('view-status');

    this.#_toggleView();

    return {
      previousView: previousView,
      view        : $(this.#_id).data('view-status'),
    };
  }

  /**
   * Get all rows.
   *
   * @param {String} mode Mode to control returned rows.
   *
   * @returns {Object[]} Array of all rows loaded in the DataTable. 'all' to get all rows; 'filtered' to get only filtered rows.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.getRows('filtered');
   */
  getRows(mode = 'all')
  {
    let rules = {};

    if (mode == 'filtered')
    {
      rules = { search: 'applied' };
    }

    const dtRows      = this.#_datatable.rows(rules);
    const dtRowsData  = this.#_datatable.rows().data();
    const rowIndexes  = dtRows[0];
    const rows        = [];

    rowIndexes.forEach(index => rows.push(dtRowsData[index]));

    return rows;
  }

  /**
   * Get data of a row.
   *
   * @param {Number|String} rowIndex Row index.
   *
   * @returns {Object} Data object specified by row index.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.getRowData(0);
   */
  getRowData(rowIndex = -1)
  {
    if (rowIndex > -1)
    {
      return this.#_datatable.row(rowIndex).data();
    }

    return [];
  }

  /**
   * Get ID of selected rows.
   *
   * @param {String} rowSelector Row selector.
   *
   * @returns {Array} Array of seleceted rows ID.
   */
  getSelectedRowIds(rowSelector = '.selected')
  {
    const ids = [];
    const selectedData = this.#_datatable.rows(rowSelector).data();

    for (let index = 0; index < selectedData.length; index++)
    {
      const data = selectedData[index];
      if (Array.isArray(data))
      {
        // support data insertion using row.add().draw()
        data.forEach(element => {
          if (element.indexOf('type="checkbox"') > -1)
          {
            const checkboxElement = $(element);
            const id = checkboxElement.data('id');

            ids.push(id);
          }
        });
      }
      else
      {
        ids.push(data.id);
      }
    }

    return ids;
  }

  /**
   * Get ID of visible and selected rows.
   *
   * @returns {Array} Array of visible and selected rows ID.
   */
  // getVisibleSelectedRowIds()
  // {
  //   return this.getSelectedRowIds('.selected:visible');
  // }

  /**
   * Get data of selected rows.
   *
   * @param {String} rowSelector Row selector.
   *
   * @returns {Array} Array of selected rows data.
   */
  getSelectedRowDatas(rowSelector = '.selected')
  {
    const datas = [];
    const selectedData = this.#_datatable.rows(rowSelector).data();

    for (let index = 0; index < selectedData.length; index++)
    {
      datas.push(selectedData[index]);
    }

    return datas;
  }

  /**
   * Get data of visible and selected rows.
   *
   * @returns {Array} Array of visible and selected rows data.
   */
  // getVisibleSelectedRowDatas()
  // {
  //   return this.getSelectedRowDatas('.selected:visible');
  // }

  /**
   * Reload DataTable data from Ajax data source.
   *
   * @param {Function}  callback    Function which is executed when the data has been reloaded and the table fully redrawn.
   * @param {Boolean}   resetPaging Reset or hold the current paging position.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.refresh();
   */
  // https://datatables.net/reference/api/ajax.reload()
  refresh(callback = null, resetPaging = true)
  {
    const hasAjax = this.#_props.ajax
      ? true
      : false;

    if (hasAjax)
    {
      this.#_datatable.ajax.reload(callback, resetPaging);
    }
    else
    {
      if (this.#_datatable.rows().data().length > 0)
      {
        this.resetOrder();
      }
    }
  }

  /**
   * Register DataTable event listener.
   *
   * @param {String}    event     Event name.
   * @param {String}    selector  Descendants of the selected elements.
   * @param {Function}  callback  Callback function.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.on('click', callback_function () {});
   */
  on(event, selector, callback)
  {
    $(this.#_id).on(event, selector, callback);
  }

  /**
   * Filter data.
   *
   * @param {String} input  Search string to apply to the DataTable.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.search('100');
   */
  search(input = '')
  {
    this.#_datatable.search(input).draw();
  }

  /**
   * Update Data.
   *
   * @param {Object[]}  data        New Data.
   * @param {Boolean}   resetPaging Reset or hold the current paging position.
   */
  updateData(data, resetPaging = true)
  {
    if (!resetPaging)
    {
      // current page info
      const page        = this.#_datatable.page.info();
      const page_number = page.page;
      // console.log(page)

      this.#_current_page = page_number;
    }

    this.resetOrder();

    this.clearData();

    this.#_datatable
      .rows
      .add(data)
      .draw();

    // remain page
    if (!resetPaging)
    {
      // new page info
      const new_page        = this.#_datatable.page.info();
      const new_page_total  = new_page.pages - 1;

      // console.log(this.#_current_page)
      // console.log(new_page_total)

      this.#_current_page = this.#_current_page <= new_page_total
        ? this.#_current_page
        : new_page_total;

      // console.log(this.#_current_page)
      this.#_datatable
        .page(this.#_current_page)
        .draw(false);
    }
  }

  /**
   * Clear Data.
   */
  clearData()
  {
    this.#_datatable
      .clear()
      .draw();
  }

  /**
   * Restore the order in which data was read into a DataTable.
   */
  resetOrder()
  {
    this.#_datatable
      .order
      .neutral()
      .draw();
  }

  /**
   * Select a row.
   *
   * @param {Number|String} rowIndex Row index.
   */
  select(rowIndex)
  {
    const row_data = this.#_datatable.rows(rowIndex).data();

    if (Array.isArray(row_data[0]))
    {
      // support data insertion using row.add().draw()
      $(`${this.#_id} tbody tr:eq(${rowIndex}) input[type="checkbox"]`).prop('checked', true);
    }

    this.#_datatable.rows(rowIndex).select();
  }

  /**
   * Deselect a row.
   *
   * @param {Number|String} rowIndex Row index.
   */
  deselect(rowIndex)
  {
    const row_data = this.#_datatable.rows(rowIndex).data();

    if (Array.isArray(row_data[0]))
    {
      // support data insertion using row.add().draw()
      $(`${this.#_id} tbody tr:eq(${rowIndex}) input[type="checkbox"]`).prop('checked', false);
    }

    this.#_datatable.rows(rowIndex).deselect();
  }

}