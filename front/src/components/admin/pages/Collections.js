import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ButtonAdd,
  ButtonConfirm,
  ButtonDelete,
  ButtonModify,
  ButtonSee,
  ButtonCancel,
  Cards,
  Encarts,
  Pagination,
  SearchBar,
  Tables,
  Form
} from "../common/";

export default function Collections() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  const [pagesNb, setPagesNb] = useState(0);
  const [activePage, setActivePage] = useState(1);

  const [pagesNb2, setPagesNb2] = useState(0);
  const [activePage2, setActivePage2] = useState(1);

  const fetchData = () => {
    axios
      .get("/collection/all/ASC") //liste les collections
      .then(res => {
        if (res.data.length <= 10) {
          setPagesNb(1);
          setData([]);
          for (let i = 0; i < res.data.length; i++) {
            setData(data => [...data, res.data[i]]);
          }
        } else if (activePage === 1) {
          setPagesNb(parseInt(res.data.length / 10 + 1));
          setData([]);
          for (let i = 0; i < 10; i++) {
            setData(data => [...data, res.data[i]]);
          }
        } else if (activePage === pagesNb) {
          setPagesNb(parseInt(res.data.length / 10 + 1));
          setData([]);
          for (let i = activePage * 10 - 10; i < res.data.length; i++) {
            setData(data => [...data, res.data[i]]);
          }
        } else {
          setPagesNb(parseInt(res.data.length / 10 + 1));
          setData([]);
          for (let i = activePage * 10 - 10; i < activePage * 10; i++) {
            setData(data => [...data, res.data[i]]);
          }
        }
      });

    axios
      .get("/category/all/ASC") //liste les catégories
      .then(res => {
        if (res.data.length <= 10) {
          setPagesNb2(1);
          setData2([]);
          for (let i = 0; i < res.data.length; i++) {
            setData2(data2 => [...data2, res.data[i]]);
          }
        } else if (activePage2 === 1) {
          setPagesNb2(parseInt(res.data.length / 10 + 1));
          setData2([]);
          for (let i = 0; i < 10; i++) {
            setData2(data2 => [...data2, res.data[i]]);
          }
        } else if (activePage2 === pagesNb) {
          setPagesNb2(parseInt(res.data.length / 10 + 1));
          setData2([]);
          for (let i = activePage2 * 10 - 10; i < res.data.length; i++) {
            setData2(data2 => [...data2, res.data[i]]);
          }
        } else {
          setPagesNb2(parseInt(res.data.length / 10 + 1));
          setData2([]);
          for (let i = activePage * 10 - 10; i < activePage * 10; i++) {
            setData2(data2 => [...data2, res.data[i]]);
          }
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [activePage]);

  useEffect(() => {
    fetchData();
  }, [activePage2]);

  const changePagePlus = table => {
    table === "collections"
      ? setActivePage(activePage + 1)
      : setActivePage2(activePage2 + 1);
  };

  const changePageMoins = table => {
    table === "collections"
      ? setActivePage(activePage - 1)
      : setActivePage2(activePage2 + 1);
  };

  const orderBy = (type, order, page) => {
    let theData = "";
    if (page === "collections") {
      theData = data;
      setData([]);
    } else if (page === "categories") {
      theData = data2;
      let dataToset = data2;
      setData2([]);
    }

    let name = type;
    console.log(type, order);
    theData.sort((a, b) => {
      console.log(typeof a[type]);
      if (typeof a[type] == "number") {
        if (order === "desc") return b[name] - a[name];
        else return a[name] - b[name];
      }
      if (typeof a[type] == "string") {
        if (order === "desc") {
          if (a[name] < b[name]) return -1;
          if (a[name] > b[name]) return 1;
          return 0;
        } else {
          if (a[name] > b[name]) return -1;
          if (a[name] < b[name]) return 1;
          return 0;
        }
      }
    });

    if (page === "collections") setData(data => [...data, ...theData]);
    if (page === "categories") setData2(data2 => [...data2, ...theData]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Encarts title="Liste des collections">
        <div className="tableActions border-gray">
          <SearchBar />
          <div className="addDiv">
            Ajouter <ButtonAdd />
          </div>
        </div>

        <Tables
          page="collections"
          orderBy={orderBy}
          donnees={data ? data : "loading"}
        />
        <Pagination
          nbPages={pagesNb}
          activePage={activePage}
          changePagePlus={changePagePlus}
          changePageMoins={changePageMoins}
          setActivePage={setActivePage}
          table='collections'
        />
      </Encarts>

      <Encarts title="Liste des catégories">
        <div className="tableActions border-gray">
          <SearchBar />
          <div className="addDiv">
            Ajouter <ButtonAdd />
          </div>
        </div>

        <Tables
          page="categories"
          orderBy={orderBy}
          donnees={data2 ? data2 : "loading"}
        />
        <Pagination
          nbPages={pagesNb2}
          activePage={activePage2}
          changePagePlus={changePagePlus}
          changePageMoins={changePageMoins}
          setActivePage={setActivePage2}
          table='categories'
        />
      </Encarts>
    </>
  );
}
