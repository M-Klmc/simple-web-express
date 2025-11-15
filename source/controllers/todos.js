// controllers

import { getList, getItem } from "../models/todos.js";

export function mainPage(req, res) {
  let list = getList();

  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    list = list.filter(el => {
    return el.title.toLowerCase().includes(q) || (el.desc && el.desc.toLowerCase().includes(q))
    });
  }
    res.render('main', {
    todos: list,
    title: 'MainPage',   
    searchQuery: req.query.search || ''
  })
}

export function detailPage(req, res) {
  const t = getItem(req.params.id);

  if (!t) {
    errorPage(req, res);
    return;
  }
  res.render("detail", {
    todo: t,
    title: t.title,
  });
}

function errorPage(req, res) {
  res.status(404);
  res.render("404", {
    title: "ERROR",
  });
}
