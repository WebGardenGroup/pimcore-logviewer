pimcore.registerNS('pimcore.plugin.WggLogviewerBundle.panel')
pimcore.plugin.WggLogviewerBundle.panel = Class.create({

  initialize: function () {
    this.getTabPanel()
  },

  activate: function () {
    Ext.getCmp('pimcore_panel_tabs').setActiveItem('pimcore_logviewer')
  },

  getTabPanel: function () {
    if (!this.panel) {
      this.panel = new Ext.Panel({
        id: 'pimcore_logviewer',
        title: t('logviewer.title'),
        iconCls: 'pimcore_icon_logviewer_color',
        border: false,
        layout: 'border',
        closable: true,
        items: [this.getTree(), this.getViewPanel()]
      })

      const tabPanel = Ext.getCmp('pimcore_panel_tabs')
      tabPanel.add(this.panel)
      tabPanel.setActiveItem('pimcore_logviewer')

      this.panel.on('destroy', function () {
        pimcore.globalmanager.remove('logviewer')
      })

      pimcore.layout.refresh()
    }
    return this.panel
  },

  getTree: function () {
    if (!this.tree) {
      const store = Ext.create('Ext.data.TreeStore', {
        autoLoad: false,
        autoSync: true,
        proxy: {
          type: 'ajax',
          url: Routing.generate('wgg_logviewer_filelist'),
          reader: {
            type: 'json'
          }
        },
        root: {
          iconCls: 'pimcore_icon_logviewer'
        },
        sorters: ['text']
      })

      this.tree = Ext.create('Ext.tree.Panel', {
        store: store,
        id: 'pimcore_panel_logviewer_tree',
        region: 'west',
        autoScroll: true,
        animate: false,
        containerScroll: true,
        width: 300,
        split: true,
        listeners: this.getTreeNodeListeners(),
        rootVisible: false,
        collapsible: true
      })

      this.tree.on('render', function () {
        this.getRootNode().expand()
      })
    }

    return this.tree
  },

  getViewPanel: function () {
    if (!this.viewPanel) {
      this.viewPanel = Ext.create('Ext.TabPanel', {
        region: 'center',
        plugins:
          [
            Ext.create('Ext.ux.TabCloseMenu', {
              showCloseAll: true,
              showCloseOthers: true
            }),
            Ext.create('Ext.ux.TabReorderer', {})
          ]
      })
    }

    return this.viewPanel
  },

  getTreeNodeListeners: function () {
    return {
      itemclick: this.onTreeNodeClick.bind(this),
      beforeitemappend: function (thisNode, newChildNode) {
        newChildNode.data.leaf = true
        newChildNode.data.iconCls = 'pimcore_icon_logviewer_color'
      }
    }
  },

  onTreeNodeClick: function (tree, record) {
    this.openLogviewer(record.data)
  },

  openLogviewer: function (data) {
    const existingPanel = Ext.getCmp('pimcore_logviewer_panel_' + data.id)
    if (existingPanel) {
      this.viewPanel.setActiveItem(existingPanel)
      return
    }
    // eslint-disable-next-line no-new,new-cap
    new pimcore.plugin.WggLogviewerBundle.item(data, this)
  }
})
