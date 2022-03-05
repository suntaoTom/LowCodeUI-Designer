const storage = {
  set(key: any, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key: any) {
    let a: any = localStorage.getItem(key);
    return JSON.parse(a);
  },
  remove(key: any) {
    localStorage.removeItem(key);
  }
};
export default storage;
