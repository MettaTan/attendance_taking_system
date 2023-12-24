module.exports = {
  totalStatusCount: (arrayOfStatus) => {
    const statusCount = [
      {
        title: "PRESENT",
        count: 0,
      },
      {
        title: "UNKNOWN",
        count: 0,
      },
      {
        title: "MA",
        count: 0,
      },
      {
        title: "LEAVE",
        count: 0,
      },
      {
        title: "MC",
        count: 0,
      },
    ];
    arrayOfStatus.forEach((status) => {
      switch (status.status.AM) {
        case "PRESENT":
          statusCount[0].count += 1;
          break;
        case "UNKNOWN":
          statusCount[1].count += 1;
          break;
        case "MA":
          statusCount[3].count += 1;
          break;
        case "LEAVE":
          statusCount[5].count += 1;
          break;
        case "MC":
          statusCount[8].count += 1;
          break;
      }
    });
    return statusCount;
  },
  convertDateFormat: (date) => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    return `${day}/${month}/${year}`;
  },
};
