import Image from "next/image";
export const dynamic = "force-static";
type Props = {};

export default async function page({}: Props) {
  return (
    <div className="flex flex-col">
      <div className="h-screen p-28">
        <div className="flex flex-row justify-between">
          <div className="w-1/2 flex flex-col justify-center text-right space-y-3">
            <span className="font-medium text-3xl">
              مرحبًا بك ، نوفر لك أفضل تجربة للبحث/عرض العقارات مع ميزات البحث
              المتقدمة
            </span>
          </div>
          <div>
            <Image
              src="/assets/illustrations/undraw_real_time_analytics_re_yliv.webp"
              width={500}
              height={500}
              alt="Real time analytics"
              priority={true}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 px-28 mb-28">
        <div className="card">
          <div className="title">
            <p>أدوات البحث المتقدمة</p>
          </div>
          <div className="image relative h-52">
            <Image
              src="/assets/images/7718877.jpg"
              alt=""
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="description">
            <p>
              لدينا مجموعة متنوعة ومتميزة من أدوات البحث عبر الخرائط والأحياء
            </p>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>تجربة</p>
          </div>
          <div className="image relative h-52">
            <Image
              src="/assets/images/7718877.jpg"
              alt=""
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="description">
            <p>
              لدينا مجموعة متنوعة ومتميزة من أدوات البحث عبر الخرائط والأحياء
            </p>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>حاسبة المساحة</p>
          </div>
          <div className="image relative h-52">
            <Image
              src="/assets/images/7718877.jpg"
              alt=""
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="description">
            <p>
              لدينا مجموعة متنوعة ومتميزة من أدوات البحث عبر الخرائط والأحياء
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
