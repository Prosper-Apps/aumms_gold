// Copyright (c) 2024, efeone and contributors
// For license information, please see license.txt

frappe.ui.form.on("Jewellery Receipt", {
  setup: function (frm) {
      frm.set_query('uom', 'item_details', () => {
          return {
              filters: {
                  "is_purity_uom": 1
              }
          }
      });
  },
  refresh:function(frm) {
    frm.set_query('stone', () => {
      return {
        filters: {
          is_stone_item: 1
        }
      }
    })
  },
  has_stone: function (frm) {
    if(!frm.doc.has_stone){
      frm.set_value('stone', );
    }
    frm.fields_dict.item_details.grid.toggle_enable('has_stone', frm.doc.has_stone);
    frm.refresh_fields();
    frm.trigger('update_item_details');
  },
  stone: function(frm){
    frm.trigger('update_item_details');
  },
  update_item_details: function(frm){
    if(frm.doc.item_details){
      frm.doc.item_details.forEach(function(item){
        frappe.model.set_value(item.doctype, item.name, 'has_stone', frm.doc.has_stone);
        frappe.model.set_value(item.doctype, item.name, 'stone', frm.doc.stone);
      });
    }
    frm.refresh_fields();
  }
});

frappe.ui.form.on("Jewellery Item Receipt", {
    item_details_add: function(frm, cdt, cdn) {
        let child = locals[cdt][cdn];
        if (frm.doc.stone) {
            frappe.model.set_value(child.doctype, child.name, 'stone', frm.doc.stone);
        }
        if (frm.doc.has_stone) {
          frappe.model.set_value(child.doctype, child.name, 'has_stone', frm.doc.has_stone);
          frm.refresh_fields();
        }
        else{
          frappe.model.set_value(child.doctype, child.name, 'has_stone', 0);
        }
    },
    stone_weight: function(frm, cdt, cdn) {
        let d = locals[cdt][cdn];
        if (frm.doc.has_stone) {
            let net_weight = d.gold_weight + d.stone_weight;
            frappe.model.set_value(cdt, cdn, 'net_weight', net_weight);
            let stone_charge = d.unit_stone_charge * d.stone_weight;
            frappe.model.set_value(cdt, cdn, 'stone_charge', stone_charge)
        }frm.fields_dict.item_details.grid.toggle_enable('has_stone', frm.doc.has_stone);frm.fields_dict.item_details.grid.toggle_enable('has_stone', frm.doc.has_stone);
    },
    gold_weight: function(frm, cdt, cdn) {
      let d = locals[cdt][cdn];
      if (!frm.doc.has_stone) {
          let net_weight = d.gold_weight;
          frappe.model.set_value(cdt, cdn, 'net_weight', net_weight);
          let amount_without_making_charge = (d.gold_weight * frm.doc.board_rate)
          frappe.model.set_value(cdt, cdn, 'amount_without_making_charge', amount_without_making_charge);
        }
    },
    making_chargein_percentage: function(frm, cdt, cdn) {
      let d = locals[cdt][cdn];
      if (d.amount_without_making_charge && d.making_chargein_percentage) {
          let making_charge = d.amount_without_making_charge * (d.making_chargein_percentage / 100); // Calculate the specified percentage of amount_without_making_charge
          frappe.model.set_value(cdt, cdn, 'making_charge', making_charge);
      }
    },
    making_charge: function(frm, cdt, cdn) {
        let d = locals[cdt][cdn];
        if (d.making_charge) {
            let amount = d.amount_without_making_charge + d.making_charge
            frappe.model.set_value(cdt, cdn, 'amount', amount);
        }
    },
    stone_charge : function(frm, cdt, cdn){
      let d = locals[cdt][cdn];
      if (frm.doc.has_stone){
        let amount_without_making_charge = (d.gold_weight * frm.doc.board_rate) + d.stone_charge
        frappe.model.set_value(cdt, cdn, 'amount_without_making_charge', amount_without_making_charge);
      }
    }
});
