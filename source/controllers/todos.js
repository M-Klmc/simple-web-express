// controllers

import { getList, getItem, addItem, setDoneItem, deleteItem } from "../models/todos.js";

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

//----------------------

export function addPage (req, res) {
  res.render('add', {title: "Add Case" });
}

export function add(req, res) {
  const todo = {
    title: req.body.title,
    desc: req.body.desc || '',
    createdAt: (new Date()).toString()
  };
  addItem(todo);
  res.redirect('/');
}

export function setDone(req, res) {
  if (setDoneItem(req.params.id))
    res.redirect('/');
  else
    errorPage(req, res);
}

export function remove(req, res) {
  if (deleteItem(req.params.id))
    res.redirect('/');
  else
    errorPage(req, res);
}