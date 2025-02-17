# Eproject4
---

### Cách chạy dự án khi lần đầu tiên clone về

- Đầu tiên là clone bằng lệnh:

```github
// Nhớ là phải có ssh rồi
git clone git@github.com:Eprojectt3/Eproject31.git
```

- Sau khi clone về rồi thì checkout sang nhánh develop bằng lệnh

```github
git checkout develop
```

- Tiếp theo làm theo các lệnh sau:

```zsh
cd Eproject31
cd frontend
npm i (nếu dùng yarn thì yarn)
cd ..
cd backend
dotnet restore

// Sau đó chạy bình thường thôi
```

- Sau đó muốn code thì phải checkout sang nhánh khác theo quy tắc:

```github
// đứng từ nhánh develop:
git checkout -b feature/<ten_nguoi_code>/<so_thu_tu_issue>-<ten_issue>
// nếu đứng ở nhánh khác thì:
git checkout -b feature/<ten_nguoi_code>/<so_thu_tu_issue>-<ten_issue> develop
```

### Cách lấy code về khi có code mới được merge

---

1. **Trường hợp nếu đang code dở**

- Đầu tiên là từ nhánh mình đang code:

```github
git log --oneline
```

- Xem xem commit gần nhất có phải của mính không nếu commit gần nhất không phải của mình thì:

```github
git add .
git commit -m "#<so_thu_tu_issue> - <ten_issue>"
git checkout develop
git pull git@github.com:Eprojectt3/Eproject31.git develop
```

- Nếu commit gần nhất là của mình thì:

```github
git add .
git commit -m --amend "#<so_thu_tu_issue> - <ten_issue>"
git checkout develop
git pull git@github.com:Eprojectt3/Eproject31.git develop
```

- Sau khi làm xong 1 trong 2 bước trên thì:

```github
git checkout <nhanh_cua_minh>
```

- Sau đó viết tiếp code của mình. Đến lúc nào viết xong mà muốn push thì làm theo những bước sau:

```github
git add .
// Kiem tra xem nhanh cuoi cung la nhanh cua minh hay nhanh cua nguoi khac
// Neu la nhah cua minh thi:
git commit -m --amend "#<so_thu_tu_issue> - <ten_issue>"
// Neu khong phai nhanh cua minh
git commit -m  "#<so_thu_tu_issue> - <ten_issue>"
// Sau do
git rebase develop
// Neu conflict thi lam nhu docs git cua t
// Nho phai dam bao nhanh develop cua minh phai luon lay cap nhat code moi ve. bao gio co code moi thi lam lai nhung buoc neu tren .
// neu success thi push len thoi roi pull request den develop
```