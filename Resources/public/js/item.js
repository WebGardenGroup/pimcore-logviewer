pimcore.registerNS('pimcore.plugin.WggLogviewerBundle.item')
pimcore.plugin.WggLogviewerBundle.item = Class.create({
  initialize: function (data, parentPanel) {
    this.parentPanel = parentPanel
    this.size = 0
    this.currentIndex = 0
    this.filename = data.filename
    this.id = data.id

    this.store = new Ext.data.Store({
      remoteSort: false,
      remoteFilter: false,
      autoLoad: true,
      autoDestroy: true,
      pageSize: 0,
      sorters: [
        {
          property: 'date',
          direction: 'DESC'
        }
      ],
      fields: [
        { name: 'date', type: 'date' },
        { name: 'user', type: 'string' },
        { name: 'controller', type: 'string' },
        { name: 'route', type: 'string' },
        { name: 'route_params', type: 'string' },
        { name: 'params', type: 'string' }
      ],
      proxy: {
        type: 'ajax',
        url: Routing.generate('wgg_logviewer_tail', { filename: this.filename }),
        reader: {
          type: 'json',
          rootProperty: 'lines',
          keepRawData: true,
          transform: {
            fn: function (data) {
              this.size = data.size
              return data
            },
            scope: this
          }
        },
        extraParams: {
          size: this.size
        },
        sync: function () {
          this.store.getProxy().setExtraParam('size', this.size)
        }.bind(this)
      },
      autoSync: true,
      listeners: {
        beforeload: function (store) {
          store.getProxy().setExtraParam('size', this.size)
          store.getProxy().abort()
        }.bind(this)
      }
    })

    this.addLayout()
  },

  addLayout: function () {
    this.panel = Ext.create('Ext.grid.Panel', {
      store: this.store,
      closable: true,
      title: this.filename,
      scrollable: true,
      id: 'pimcore_logviewer_panel_' + this.id,
      plugins: 'pimcore.gridfilters',
      columns: [
        {
          dataIndex: 'date', text: t('date'), xtype: 'datecolumn', format: 'Y-m-d'
        },
        {
          dataIndex: 'date', text: t('time'), xtype: 'datecolumn', format: 'H:i:s'
        },
        {
          dataIndex: 'user',
          text: t('user'),
          filter: {
            type: 'string'
          }
        },
        {
          dataIndex: 'controller',
          text: t('controller'),
          filter: {
            type: 'string'
          }
        },
        {
          dataIndex: 'route',
          text: 'Route',
          filter: {
            type: 'string'
          }
        },
        { dataIndex: 'route_params', text: 'Route params' },
        { dataIndex: 'params', text: 'Params' }
      ],
      listeners: {
        activate: this.loadStore.bind(this),
        celldblclick: function (grid, td, cellIndex) {
          grid.ownerGrid.getColumns()[cellIndex].autoSize()
        },
        load: function () {
          Ext.each(this.panel.getColumns(), function (column) {
            column.autoSize()
          })
        }.bind(this)
      },
      tbar: [
        '->',
        {
          text: t('load'),
          iconCls: 'pimcore_icon_refresh',
          handler: this.loadStore.bind(this)
        },
        {
          text: t('clear_all'),
          iconCls: 'pimcore_icon_delete',
          handler: this.clearStore.bind(this)
        },
        {
          text: t('resize'),
          iconCls: 'pimcore_icon_move',
          handler: function () {
            Ext.each(this.panel.getColumns(), function (column) {
              column.autoSize()
            })
          }.bind(this)
        }
      ]
    })

    this.parentPanel.getViewPanel().add(this.panel)
    this.parentPanel.getViewPanel().setActiveTab(this.panel)

    pimcore.layout.refresh()
  },

  getCurrentIndex: function () {
    return this.currentIndex
  },

  loadStore: function () {
    this.store.load({
      addRecords: true
    })
  },

  clearStore: function () {
    this.store.removeAll()
  }
})
