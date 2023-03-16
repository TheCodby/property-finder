"use client";
import { NextPage } from "next";
import Map from "../components/Map";
import { useState, useReducer, useEffect } from "react";
import LoadingButton from "../components/ui/loading-button";
import { getCookie } from "cookies-next";
import { useNotifs } from "../../stores/notifs";
import Uploader from "../components/ui/uploader";
import Image from "next/image";
import { useRouter } from "next/navigation";
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_LAT":
      return { ...state, location: { ...state.location, lat: action.payload } };
    case "SET_LNG":
      return {
        ...state,
        location: { ...state.location, long: action.payload },
      };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_AREA":
      return { ...state, area: action.payload };
    case "SET_ROOMS":
      return { ...state, rooms: action.payload };
    case "SET_FLOOR":
      return { ...state, floor: action.payload };
    case "SET_BATHROOMS":
      return { ...state, bathrooms: action.payload };
    case "SET_STREET_AREA":
      return { ...state, streetArea: action.payload };
    case "SET_TYPE":
      return { ...state, typeId: action.payload };
    case "ADD_IMAGE":
      return { ...state, images: [...state.images, action.payload] };
    default:
      return state;
  }
};
const NewPostPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [types, setTypes] = useState<[]>([]);
  const [step, setStep] = useState(0);
  const [formState, dispatch] = useReducer(reducer, { images: [] });
  const { add: addNotification } = useNotifs();
  const router = useRouter();
  useEffect(() => {
    const loadTypes = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/post_types`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            dispatch({ type: "SET_TYPE", payload: data[0].id });
            setTypes(data);
          }
        });
    };
    loadTypes();
  }, []);

  const onMapChange = (latLng: any) => {
    dispatch({ type: "SET_LAT", payload: latLng.lat() });
    dispatch({ type: "SET_LNG", payload: latLng.lng() });
  };
  const createPost = async () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/posts`, {
        method: "POST",
        body: JSON.stringify(formState),
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
          Authorization: "Bearer " + getCookie("token"),
        },
      })
        .then(async (res) => {
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              throw data;
            });
          }
        })
        .then((data) => {
          addNotification(data.message, "success");
          setSuccess(true);
          router.push(`/posts/${data.postSlug}`);
        })
        .catch((err) => {
          addNotification(err.message, "error");
          setStep(0);
        });
      setLoading(false);
    }
  };
  const uploadImage = (e: any) => {
    if (formState.images.length >= 6) {
      addNotification("You added many images", "error");
      return;
    }
    const files: [] = e.target.files;
    const reader = new FileReader();
    for (let image of files) {
      reader.readAsDataURL(image);
    }
    reader.onload = () => {
      dispatch({ type: "ADD_IMAGE", payload: reader.result });
    };
  };
  return (
    <div className="flex flex-col">
      <title>عقار - إضافة منشور</title>
      <Map
        onChange={onMapChange}
        clickable={true}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="z-10 absolute top-16 right-16 lg:block hidden">
          <div
            className="card bg-transparent overflow-hidden"
            style={{
              background: "rgba(241,245,249, 0.8)",
            }}
          >
            <div
              className="relative transition-all duration-300 flex-wrap"
              style={{ transform: `translate(${step * 200}%, 0px)` }}
            >
              <div className="flex flex-col lg:flex-row gap-2">
                <div>
                  <label htmlFor="title">العنوان</label>
                  <div>
                    <input
                      required
                      type="text"
                      name="title"
                      id="title"
                      className="bg-white p-2 my-2"
                      value={formState.title}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_TITLE",
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="price">السعر</label>
                  <div>
                    <input
                      required
                      type="number"
                      id="price"
                      min={0}
                      className="bg-white p-2 lg:w-32 my-2"
                      value={formState.price}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_PRICE",
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div>
                  <label htmlFor="rooms">عدد الغرف</label>
                  <div>
                    <input
                      required
                      type="number"
                      id="rooms"
                      min={0}
                      className="bg-white p-2 lg:w-32 my-2"
                      value={formState.rooms}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_ROOMS",
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="area">المساحة</label>
                  <div>
                    <input
                      required
                      type="number"
                      id="area"
                      min={0}
                      className="bg-white p-2 lg:w-32 my-2"
                      value={formState.area}
                      onChange={(e) => {
                        dispatch({ type: "SET_AREA", payload: e.target.value });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="street-area">مساحة الشارع</label>
                  <div>
                    <input
                      required
                      type="number"
                      id="street-area"
                      min={0}
                      className="bg-white p-2 lg:w-32 my-2"
                      value={formState.streetArea}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_STREET_AREA",
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-2">
                <div>
                  <label htmlFor="type">النوع</label>
                  <select
                    required
                    className="bg-white my-2"
                    id="type"
                    onChange={(e) =>
                      dispatch({ type: "SET_TYPE", payload: e.target.value })
                    }
                  >
                    {types.map((type: any) => (
                      <option value={type.id} key={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="floor">الطابق</label>
                  <div>
                    <input
                      required
                      type="number"
                      id="floor"
                      min={0}
                      className="bg-white p-2 lg:w-32 my-2"
                      value={formState.floor}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_FLOOR",
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="bathrooms">دورات المياه</label>
                  <div>
                    <input
                      required
                      type="number"
                      id="bathrooms"
                      min={0}
                      className="bg-white p-2 lg:w-32 my-2"
                      value={formState.bathrooms}
                      onChange={(e) => {
                        dispatch({
                          type: "SET_BATHROOMS",
                          payload: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <textarea
                required
                className="bg-white p-2 my-2 w-full"
                placeholder="وصف العقار"
                rows={6}
                onChange={(e) => {
                  dispatch({
                    type: "SET_DESCRIPTION",
                    payload: e.target.value,
                  });
                }}
              >
                {formState.description}
              </textarea>
              <div
                className="flex flex-row gap-4 items-center absolute w-full"
                style={{ right: "200%", top: 0 }}
              >
                {formState.images.map((image: string, index: number) => (
                  <div className="w-32 h-32 relative" key={index}>
                    <Image
                      src={image}
                      fill
                      style={{ objectFit: "cover" }}
                      alt=""
                      className="rounded-3xl"
                    />
                  </div>
                ))}
                <Uploader onUpload={uploadImage} />
              </div>
              <div
                className="flex flex-col gap-4 items-center justify-center absolute w-full"
                style={{ right: "400%", top: 0 }}
              >
                {loading ? (
                  <>
                    <div className="relative w-64 h-64">
                      <Image
                        fill
                        alt=""
                        src="/assets/loading.svg"
                        className="animate-spin"
                      />
                    </div>
                    <p className="text-3xl font-semibold motion-safe:animate-bounce">
                      جاري الإضافة
                    </p>
                  </>
                ) : success ? (
                  <>
                    <p className="text-3xl font-semibold">
                      تم الإضافة بنجاح {`\n`} سيتم تحويلك بعد 5 ثواني للمنشور
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center my-4 gap-x-2">
            {step === 1 ? (
              <button
                className="px-5"
                onClick={() => setStep(0)}
                disabled={loading}
              >
                السابق
              </button>
            ) : null}
            {!success ? (
              <button className="px-5 " onClick={createPost} disabled={loading}>
                {!loading ? step === 0 ? "التالي" : "إضافة" : <LoadingButton />}
              </button>
            ) : null}
          </div>
        </div>
      </Map>
    </div>
  );
};

export default NewPostPage;
