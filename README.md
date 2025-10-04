# 22694611-TranLeKiet-EProject
Dự án phục vụ cho việc học. Được cung cấp bởi ThS. Huỳnh Nam 

Du an su dung: Push-based

Trong co che thuc hien giao tiep bat dong bo trong misro service co 2 loai
- Thong qua protocal
- Thong qua AMQP: Su dung co che
  -- Push-based: 1 ben cung cap, 1 ben tieu thu (Provider va Consumer)
  -- Ho tro rat tot tren kien truc Event-driver
  -- Cong cu ho tro AMQP RabbitMQ

API Gateway: Dinh tuyen yeu cau (Request routing)
  -- Bang cach tiep nhan request tu khach hang, phan giai thanh cac endpoint de chuyen tiep den cac MS phu hop
  -- Potocal transaction, API Gateway co the xu ly sao cho phu hop ve mat giao thuc cua khac hang sao cho phu hop MS
  -- Xac thuc uy quyen, API Gateway co the cung cap xac thuc va phan quyen nham bao mat truy cap tu Cilent tren MS
  -- Chuyen doi yeu cau va phan hoi, API Gateway co the sua doi thong trong request hoac trong reponsive de phu hop voi tai trong server
  -- Gioi han dung luong cho phep gioi han so luong yeu cau ma request user duoc gui den nham ngan ngua qua tai, dam bao su phan bo tai nguyen cong bang
  -- Bo nho dem caching, API getway co the luu tru bo nho dem voi nhung yeu cau thuong xuyen nham giam tai cho dich vu

Authentication Service: Dich vu dung de xac thuc va uy quyen nguoi dung, dong vai tro quan trong trong viec bao mat he thong va bao mat thong tin nguoi dung
Product Service: La dich vu lien quan den quan ly san pham, cung cap cac api de truy xuat thong tin san pham nhu CRUD
Order Service: La dich vu chuyen phuc vu qua trinh tao, xu ly don hang, dich vu nay se giao tiep voi Product Service

Clean Architecture la mot xay dung kien truc sach, trong do viec xay dung co su tach biet ro rang giua cac cap khac nhau. Cau truc ma nguon tren tung MS nhu sau:
- Modal: Mo hinh dinh nghia cau truc du lieu
- Reponsitories: Tang xu ly truy cap CSDL thuc hien chuc nang CRUD
- Services: Thuc hien cac yeu cau nghiep vu cua service
- Controllers: La bo tiep nhan, xu ly, dieu huong cac yeu cau tu ben ngoai gui vao
- Middware: Tang trung gian xu ly request, reponsive

Qua trinh giao tiep
- Buoc 1: Khi nguoi dung tien hanh dat hang thong qua sevice product thi 1 yeu cau tao ra di vao API gateway, gui den endpoint product/page. Service product se xuat ban chi tiet vao hang doi Product queue.
- Buoc 2: Order lang nghe tin nhan tu Order Queue. Khi nhan tin nhan se tiep nhan chi tiet don hang, doi chieu gia ca va san pham. Roi tao ra don hang moi vo CSDL Orders DB
- Buoc 3: Sau khi don hang duoc tao thi dich vu order se xuat bang cac san pham duoc lien ket voi don hang do vao Products Queue. Buoc nay nham xac minh don hang duoc tao thanh cong.
- Buoc 4: MS Service se lang nghe tin nhan tu Product Queue, Product service se tien hanh xuat bang in ra hoa don cho nguoi dung

3 thanh phan quan trong trong Private RabbitMQ
-Producer: Tin nhan se duoc luu tru trong Queue theo dang FI-FO, luu tru trong RAM hoac CSDL
-Cosumer: Tiep nhan tin nhan theo co che Push-based


Co che cai dac Private RabbitMQ
- Xem trong (product/src/controllers/productController.js)