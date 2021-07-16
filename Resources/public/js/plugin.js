pimcore.registerNS('pimcore.plugin.WggLogviewerBundle')

pimcore.plugin.WggLogviewerBundle = Class.create(pimcore.plugin.admin, {
  getClassName: function () {
    return 'pimcore.plugin.logviewer'
  },

  initialize: function () {
    pimcore.plugin.broker.registerPlugin(this)
  },

  /**
   * Open log viewer tab, or activate when already open.
   */
  openLogviewer: function () {
    try {
      pimcore.globalmanager.get('logviewer').activate()
    } catch (e) {
      // eslint-disable-next-line new-cap
      pimcore.globalmanager.add('logviewer', new pimcore.plugin.WggLogviewerBundle.panel())
    }
  },

  pimcoreReady: function (/* params, broker */) {
    if (pimcore.currentuser.permissions.indexOf('logviewer.permission') >= 0) {
      const layoutToolbar = pimcore.globalmanager.get('layout_toolbar')
      if (layoutToolbar.extrasMenu) {
        layoutToolbar.extrasMenu.add(new Ext.Action({
          id: 'logviewer_button',
          text: t('logviewer.title'),
          iconCls: 'pimcore_icon_logviewer',
          handler: this.openLogviewer.bind(this)
        }))
      }
    }
  }
})

// eslint-disable-next-line no-new
new pimcore.plugin.WggLogviewerBundle()
