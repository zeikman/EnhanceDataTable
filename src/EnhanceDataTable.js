/** En enhanced version of jQuery DataTable with various useful built-in methods and functionalities. */
class EnhanceDataTable
{
  // NOTE: Static Methods ========== ========== ========== ========== ========== ========== ========== ==========

  // NOTE: Private Properties ========== ========== ========== ========== ========== ========== ========== ==========

  /** @private */
  #_datatable;

  /** @private */
  #_id;

  /** @private */
  #_default_thead;

  /** @private */
  #_view_status = 'table';

  /** @private */
  #_export_config = {
    // filename      : 'Pending Complaint List',
    // title         : 'Pending Complaint List',
    // messageTop    : 'Complaint - Pending',
    exportOptions : {
      columns: ':visible',
      // modifier: {
      //   // print only the current DataTable page
      //   page: 'current',
      // }
    }
  };

  /** @private */
  #_zproplist = [];

  /** @private */
  #_zprop = {};

  /**
   * Default properties
   *
   * @private
   */
  #_props = {
    // EnhanceDataTable property
    column_hide_in_card: [],
    three_states_sort: true,
    show_row_number: true,
    show_checkbox: false,

    // same with DataTable property //

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

    // buttons config
    /* buttons: [
      {
        extend        : 'colvis',
        text          : 'Toggle Column',
        titleAttr     : 'Show/Hide Column',
        columns       : ':not(.noVis)',
        align         : 'button-right',
        postfixButtons: [ 'colvisRestore' ],
      },
      {
        extend        : 'collection',
        // text          : 'Action <i class="fas fa-chevron-down fa-fw"></i>',
        text          : 'Action',
        titleAttr     : 'Select Action',
        align         : 'button-right',
        buttons       : [
          // 'copy',
          {
            extend    : 'print',
            autoPrint : false,
            ...this.#_export_config,
          },
          {
            extend    : 'csv',
            text      : 'Export to CSV',
            ...this.#_export_config,
          },
          {
            extend    : 'excel',
            text      : 'Export to Excel',
            ...this.#_export_config,
          },
          {
            extend    : 'pdf',
            text      : 'Print to PDF',
            ...this.#_export_config,
          },
        ]
      },
    ], */

  };

  /** @private */
  #_initDataTable()
  {
    this.#_retainDefaultTheadStructure();
    this.#_setupRowCallback();
    this.#_setupInitComplete();
    this.#_setupCheckboxColumn();
    this.#_setupRowNumber();

    const datatable_id = this.#_id;

    if ($(datatable_id).length > 0)
    {
      const props   = this.#_props;
      const wrapper = `${datatable_id}_wrapper`;

      this.#_datatable = $(datatable_id).DataTable(props);

      $(wrapper).addClass('table-view');
    }
    else
    {
      return console.error(`[EnhanceDataTable] Error: DOM element '${datatable_id}' not found !`);
    }
  }

  /** @private */
  #_retainDefaultTheadStructure()
  {
    this.#_default_thead = $(`${this.#_id} thead`).clone();

    // console.log(this.#_default_thead)
  }

  /** @private */
  #_setupRowCallback()
  {
    const self = this;
    const wrapper = `${self.#_id}_wrapper`;
    let userDefinedRowCallback = function () {};

    // store user defined rowCallback
    if (this.#_props.rowCallback && typeof this.#_props.rowCallback == 'function')
    {
      userDefinedRowCallback = this.#_props.rowCallback;
    }

    delete this.#_props.rowCallback;

    this.#_props.rowCallback = function (row, data, displayNum, displayIndex, dataIndex)
    {
      // console.error('------------------------------')
      // console.log(row)
      // console.log(data)
      // console.log(displayNum)
      // console.log(displayIndex)
      // console.log(dataIndex)

      // handle reload content during card view
      if ($(wrapper).hasClass('dt-card'))
      {
        const labels = self.#_getColumnWithoutColspan();

        $('td', row).each(function (column, td)
        {
          if ($(td).find('label').length == 0)
          {
            $(`<label class='cardview-col-header'>${labels[column]}</label>`).prependTo($(this));
          }
        });
      }

      userDefinedRowCallback(row, data, displayNum, displayIndex, dataIndex);

    };
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
      // console.log(theadRows)

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
    // let row_result = [];

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

    // console.log(row_1)
    // console.log(row_2)

    if (use_default_thead)
    {
      row_1.forEach((th, index) => {
        const colspan = $(th).attr('colspan');
        // console.log(th)
        // console.log(colspan)

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

    // console.log(row_result)
    return row_result;
  }

  /** @private */
  #_setupInitComplete()
  {
    const self = this;
    const wrapper = `${self.#_id}_wrapper`;
    let userDefinedInitComplete = function () {};

    // store user defined initComplete
    if (this.#_props.initComplete && typeof this.#_props.initComplete == 'function')
    {
      userDefinedInitComplete = this.#_props.initComplete;
    }

    delete this.#_props.initComplete;

    // internal must run initComplate > generate table-card view toggle
    this.#_props.initComplete = function (settings, json)
    {
      // console.log('initComplete') // DEBUG

      const wrapper = `${self.#_id}_wrapper`;

      if (self.#_props.buttons)
      {
        self.#_props.buttons.forEach((button, index) => {
          if (typeof button == 'string')
          {
            if (button == 'reload')
            {
              // setup reload button
              self.#_setupButtonReload(index);
            }

            if (button == 'cardview')
            {
              // setup toggle table-card view button
              self.#_setupButtonToggleCardView(index);
            }
          }

          if (typeof button == 'object')
          {
            //
          }
        });
      }

      // Input search ESC-key event
      self.#_setupInputSearchEscEvent();

      // run user defined initComplete
      userDefinedInitComplete(settings, json);

    };
  }

  /**
   * Render reload button
   *
   * @private
   */
  #_setupButtonReload(insertAtPosition)
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    if (insertAtPosition == 0)
    {
      $(`${wrapper} .dt-buttons.btn-group`).prepend(
        `<button id="${self.#_id.slice(1)}_dt_reload" class="btn dt-reload-button" title="Reload Data">
          <i class="fas fa-sync text-green"></i>
        </button>`
      );
    }
    else
    {
      $(
        `<button id="${self.#_id.slice(1)}_dt_reload" class="btn dt-reload-button" title="Reload Data">
          <i class="fas fa-sync text-green"></i>
        </button>`
      ).insertAfter(`${wrapper} .dt-buttons > :nth-child(${insertAtPosition})`);
    }

    $(wrapper).on('click', `${self.#_id}_dt_reload`, self.refresh.bind(
      self,
      null/* callback */,
      true/* resetPaging */
    ));
  }

  /**
   * Render toggle table/card view button
   *
   * @private
   */
  #_setupButtonToggleCardView(insertAtPosition)
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    if (insertAtPosition == 0)
    {
      $(`${wrapper} .dt-buttons.btn-group`).prepend(
        `<button id="${self.#_id.slice(1)}_dt_cardview" class="btn _btn-default dt-toggle-view-button" title="Toggle View">
          <i class="fas fa-table"></i>
          <i class="fas fa-arrows-h fa-fw"></i>
          <i class="fas fa-id-card"></i>
        </button>`
      );
    }
    else
    {
      $(
        `<button id="${self.#_id.slice(1)}_dt_cardview" class="btn _btn-default dt-toggle-view-button" title="Toggle View">
          <i class="fas fa-table"></i>
          <i class="fas fa-arrows-h fa-fw"></i>
          <i class="fas fa-id-card"></i>
        </button>`
      ).insertAfter(`${wrapper} .dt-buttons > :nth-child(${insertAtPosition})`);
    }

    $(wrapper).on('click', `${self.#_id}_dt_cardview`, function ()
    {
      // hide in card view, but can re-open using column toggle
      const toggle_columns_visibility =
        self.#_props.column_hide_in_card && typeof self.#_props.column_hide_in_card == 'object'
          ? self.#_props.column_hide_in_card
          : [];

      if ($(wrapper).hasClass('dt-card'))
      {
        // when turn into table view
        self.#_datatable
          .columns(toggle_columns_visibility)
          .visible(true);

        $(`${wrapper} .cardview-col-header`).remove();

      }
      else
      {
        // when turn into card view
        const labels = self.#_getColumnWithoutColspan();

        $(`${self.#_id} tbody tr`).each(function ()
        {
          $(this)
            .find('td')
            .each(function (column)
            {
              $(`<label class='cardview-col-header'>${labels[column]}</label>`).prependTo(
                $(this)
              );
            });
        });

        self.#_datatable
          .columns(toggle_columns_visibility)
          .visible(false);
      }

      $(wrapper).toggleClass('dt-card');

      self.#_view_status = $(wrapper).hasClass('dt-card')
        ? 'card'
        : 'table';

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

      // Emit toggle table-card event
      const toggleView = new CustomEvent('toggleView', {
        detail: {
          view: self.#_view_status,
        },
      });

      $(self.#_id)[0].dispatchEvent(toggleView);

    });
  }

  /**
   * Setup input search ESC-key event
   *
   * @private
   */
  #_setupInputSearchEscEvent()
  {
    const self = this;
    const wrapper = `${this.#_id}_wrapper`;

    $(`${wrapper} .dataTables_filter input[type="search"]`).on('keyup', function(e)
    {
      // ESC to clear
      if (e.which == 27)
      {
        self.#_datatable.search('').draw();
      }
    });
  }

  /**
   * @private
   */
  #_setupRowNumber()
  {
    if (this.#_props.show_row_number)
    {
      const hasIndexColumn = this.#_props.columns.find((column) => column.data == 'rowNumber');

      if (!hasIndexColumn)
      {
        // Find maximum rowspan
        let maxRowSpan = 1;
        // let attrRowSpan = '';

        $(`${this.#_id} thead th`).each((index, th) => {
          const thRowSpan = $(th).attr('rowspan');

          if (thRowSpan > maxRowSpan)
          {
            maxRowSpan = thRowSpan;
          }
        });

        // if (maxRowSpan > 0)
        //   attrRowSpan = `rowspan="${maxRowSpan}"`;;
        // console.log(attrRowSpan)
        // attrRowSpan = '';

        // Auto append row number DOM
        const indexColumn = `<th rowspan="${maxRowSpan}" class="column-row-number">#</th>`;

        $(`${this.#_id} thead tr:first-child`).prepend($(indexColumn));

        // Auto append row number column data
        this.#_props.columns.unshift({
          data      : 'rowNumber',
          searchable: false,
          orderable : false,
          sortable  : false,
          className : 'column-row-number',
          width     : 30,
          // render    : function (data, type, row, meta)
          // {
          //   console.log(data)
          //   // console.log(type)
          //   // console.log(row)
          //   // console.log(meta)
          // }
        });
      }
    }
  }

  /**
   * @private
   */
  #_setupCheckboxColumn()
  {
    const self = this;

    if (this.#_props.show_checkbox)
    {
      const hasCheckboxColumn = this.#_props.columns.find((column) => column.data == 'checkbox');

      if (!hasCheckboxColumn)
      {
        // Auto append checkbox DOM
        const checkboxColumn = `<th class="column-checkbox-header dt-center">
          <input type="checkbox" class="form-check-input" />
        </th>`;

        const checkboxColumnElement = $(checkboxColumn);

        checkboxColumnElement.on('click', 'input', function ()
        {
          if (this.checked)
          {
            self.#_datatable.rows().select();

            $(`${self.#_id} tbody td .column-checkbox`);
          }
          else
          {
            self.#_datatable.rows().deselect();
          }
        });

        $(`${this.#_id} thead tr:first-child`).prepend(checkboxColumnElement);

        // Auto append checkbox column data
        this.#_props.columns.unshift({
          data      : 'checkbox',
          searchable: false,
          orderable : false,
          sortable  : false,
          className : 'dt-center',
          width     : 21,
          render    : function (data, type, row, meta)
          {
            return `<input type="checkbox" class="form-check-input column-checkbox" />`;
            // console.log(data)
            // console.log(type)
            // console.log(row)
            // console.log(meta)
          }
        });
      }
    }
  }

  /**
   * Render row index
   * https://datatables.net/examples/api/counter_columns.html
   * @private
   */
  #_renderRowNumberEvent()
  {
    const self = this;
    const wrapper = `${self.#_id}_wrapper`;

    this.#_datatable.on('order.dt search.dt', function (e)
    {
      if (self.#_props.show_row_number)
      {
        let i = 1;

        self.#_datatable.cells(null, 0, { search: 'applied', order: 'applied' }).every(function (cell)
        {
          // handle reload during card view
          if ($(wrapper).hasClass('dt-card'))
          {
            const first_column_text = $(`${self.#_id} thead th:first`).text();

            this.data(`<label class='cardview-col-header'>${first_column_text}</label>${(i++).toString()}`);
          }
          else
          {
            this.data(i++);
          }
        });
      }

      // three_states_sort
      if (self.#_props.three_states_sort)
      {
        if (e.type == 'order')
        {
          /**
           * 3 states sort : asc | desc | no_sort
           *  https://stackoverflow.com/a/43125208/4679429
           */
          if (self.#_datatable.settings().order().length === 1)
          {
            var order = self.#_datatable.settings().order()[0];
            var th = $(`${self.#_id} th:eq(${order[0]})`);

            if (th.attr('data-sort-next') === 'false')
            {
              // self.#_datatable.order([]).draw();

              /**
               * restore order
               *  https://datatables.net/plug-ins/api/order.neutral()
               */
              self.#_datatable
                .order
                .neutral()
                .draw();

              // th.attr('data-sort-next', true);
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
    const wrapper = `${self.#_id}_wrapper`;

    this.#_datatable.on('column-visibility.dt', function(e, settings, column, state)
    {
      if ($(wrapper).hasClass('dt-card'))
      {
        if (state)
        {
          /* self.#_datatable.rows().every(function (rowIdx, tableLoop, rowLoop)
          {
            const rowNode = this.node();

            $(rowNode).find('td').each();
          }); */

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
                  // console.log(labels)
                  // console.log(column)
                }

                if (nth_column_text == undefined)
                {
                  nth_column_text = 'Error Column';
                }

                /*/
                // console.log(this.column().visible())
                // console.log(this.data())
                console.log(column)
                console.log(nth_column_text)
                // console.log(original_content)
                //*/

                this.data(`<label class='cardview-col-header'>${nth_column_text}</label>${original_content}`);
              }
            });
          }
        }
      }
    });
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

    /*/
    // spread operator
    this.#_props = {
      ...this.#_props,
      ...args,
    };
    /*/
    // lodash
    // https://betterprogramming.pub/how-to-merge-deeply-nested-objects-in-javascript-27e12107480e
    this.#_props = _.merge(
      this.#_props,
      args,
    );
    //*/

    this.#_initDataTable();
    this.#_renderRowNumberEvent();
    this.#_columnVisibilityEvent();
  }
  // end of constructor

  // NOTE: Public Methods ========== ========== ========== ========== ========== ========== ========== ==========

  /**
   * Gets DataTable object.
   *
   * @returns {Object} DataTable object.
   *
   * @example
   * const dt = new EnhanceDataTable();
   * dt.getDataTable();
   */
  getDataTable()
  {
    return this.#_datatable;
  }

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
   * @param {String}    url           Ajax URL.
   * @param {Boolean}   autoRefresh   If True, ajax will reload after URL updated.
   * @param {Function}  callback      Function which is executed when the data has been reloaded and the table fully redrawn.
   * @param {Boolean}   resetPaging   Reset or hold the current paging position.
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
    return this.#_view_status;
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
      && this.#_view_status != view
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
    // let length = $(`${this.#_id}_wrapper #dt_cardview`).length; // DEBUG
    // console.log(`toggleView > ${this.#_id}_wrapper: ${length}`) // DEBUG

    const previousView = this.#_view_status;

    $(`${this.#_id}_wrapper .dt-toggle-view-button`).trigger('click');

    return {
      previousView: previousView,
      view        : this.#_view_status,
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
  getRowData(rowIndex)
  {
    return this.#_datatable.row(rowIndex).data();
  }

  /**
   * Reload DataTable data from Ajax data source.
   *
   * @param {Function}  callback      Function which is executed when the data has been reloaded and the table fully redrawn.
   * @param {Boolean}   resetPaging   Reset or hold the current paging position.
   *
   * @returns None.
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
        this.#_datatable
          .order
          .neutral()
          .draw();
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
   * @returns None.
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

}