import Image from "next/image";
export const dynamic = "force-static";
type Props = {};

export default async function page({}: Props) {
  return (
    <div className="flex flex-col">
      <div className="md:h-screen p-10 md:p-28">
        <div className="flex flex-col md:flex-row justify-between items-center text-center gap-5">
          <div className="md:w-1/2 flex flex-col justify-center md:text-right space-y-3">
            <span className="font-medium text-2xl md:text-3xl">
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
      <div className="grid md:grid-cols-3 gap-6 px-6 md:px-28 mb-28">
        <div className="card">
          <div className="title">
            <p>نص تجريبي</p>
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
              هذا نص تجريبي لغرض العرض والتجربة هذا نص تجريبي لغرض العرض
              والتجربة هذا نص تجريبي لغرض العرض والتجربة هذا نص تجريبي لغرض
              العرض والتجربة هذا نص تجريبي لغرض العرض والتجربة
            </p>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>نص تجريبي</p>
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
              هذا نص تجريبي لغرض العرض والتجربة هذا نص تجريبي لغرض العرض
              والتجربة هذا نص تجريبي لغرض العرض والتجربة هذا نص تجريبي لغرض
              العرض والتجربة هذا نص تجريبي لغرض العرض والتجربة
            </p>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>نص تجريبي</p>
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
              هذا نص تجريبي لغرض العرض والتجربة هذا نص تجريبي لغرض العرض
              والتجربة هذا نص تجريبي لغرض العرض والتجربة هذا نص تجريبي لغرض
              العرض والتجربة هذا نص تجريبي لغرض العرض والتجربة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
