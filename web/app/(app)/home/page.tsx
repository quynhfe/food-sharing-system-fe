import FoodSearchBar from "@/components/feed/FoodSearchBar";
import FilterChipsMenu from "@/components/feed/FilterChipsMenu";
import FoodCard from "@/components/feed/FoodCard";

const mockFoods = [
  {
    id: "1",
    title: "Cơm tấm sườn nướng",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTOjWEQIvvaRes28Do3FdXvNROveBPhNxQ1baThIx3D8I3pJ5PI4kG_zrv0oHJyY9LuJYCINhUyYg0iHu63L2j0jz2eiOA6g0IC8XB0NUGWJVAJXmA7dlUBwK3pOpCkHeaPL-jcBM3_l6UNpQmGq46rJ1szJenBu5SVSoNYqt4WkxI6PIzkK0loh30DEWV9FKTuK4CQNSbURefnbMkJoF55vu6KFpMKPWHpiPLx0OT0moaQyGrvvVFuGkcZT_lPjQc6Pzj9HrxmA",
    posterName: "Bếp Bà Sáu",
    posterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDcPktpEjKsT5zE3q_jQujeMhlBdhrU7q2rJzeJdgR1bS-BAWBewcfHPrqGWGlT0W3fy1MVOkRVkYglfOFVwFf--snhjdHp4qiuUvqBA9UYuKngomZPuRj2rvR6Y3XxzPYrgQyDolW97QAGGOUMegQ8nTR13HTiPRyw1ZhUFmPp40ZjglKOGBO6BoNkcJ0jMb00OHJRPB1NyUg9d3QAG1VHKSK9EM_grc1tq15NhxU1aIKqJqIWSdAmHitnFQHKeaHGQnCwjI41LQ",
    distance: "0.8 km",
    timeLeft: "Còn 2 giờ",
    isExpiring: true,
  },
  {
    id: "2",
    title: "Bánh mì thịt nguội",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVsgcNAzH_eazu1X-sFsidrJwCs-TO6x4c8GO7nHfMIKDVtKizS7-0P7FXWznQAbkvCDld_NV-4E8cSrWc1l07dp1_UBEZcGBZuGckXoc4CsW6rpqax35f08GOK8Vs9VsD5RqnlLFSKsioqhNiYvDLGu4K1C5xNkMeKuc1OSS_jyYplf-DCYQINrleXDrYUL_7gGeMx18Sxc2ijlugSXcyxtV04k8Igp3OXEnFHBD9dRl-NGKdI1My_3uvAP8MwkF68uSnA4mFvg",
    posterName: "Tiệm bánh Kim Anh",
    posterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqrSDvOM0d865-eloL9gmcAsmr-zuITsgL8TEdtsCBMB1cSgg42BqMxfNUXmDPUFsFtp4TdhuQz_p_HTEwH0rit34qO0iE9nydN5YBNQ-QQl-b2nfm3f2RusbX7PLLTosfV_-k4BLLuxEKz3Ktda6D72zrp-yM1YCftnhlCbWPpp9O8dEZ3ytP4niYJrX0_QwFXkbVPRja5MCEkaNrtQ5WIDip-oNH-ImLNNS3IiuI2znZVBFpryKnLrRpX7t17rem_AuWI6zwFQ",
    distance: "1.2 km",
    timeLeft: "Còn 5 giờ",
    isExpiring: false,
  },
  {
    id: "3",
    title: "Phở bò tái nạm",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDu-kohyUvm46l_4P9BbqCz7wSGA1tgQEcqx3iA5Inxq_Cd6XyELPvzz7-CWWRVhyXg1YRHOVhBzKMD8f5uJjWgzQaXwFHSUc3uk8-FtNfInEpGXBot9NuT6RV2x5CpoK7JnI6i6ks5xd7-NOgNiLhMdWLuH5TgjuxHgYiX6t8aPLfcknrDl6RDYH6tKx5sSo0cLsFAXm0YhqLBT56A1IOgJcCgkDR68UdiJ4BdssO1j-4H6S6PHx30lgkb6XH6HHmBuzWJYT0LaQ",
    posterName: "Phở Lý Quốc Sư",
    posterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxxvJRtepVPzW0zC5ZUM5QRlLMEWwmDl3qBhbkpWPSPCXO_gdRHsEkoH6tevhZmInWlNgF643pHJhgk3uLlkU9udTmecyweqfKuT79NOgBiaBaGUWtrqY_bOL0OXnUW_NDDnfq7kNluV8uknNN9AQN0vtkL1hkFCT9BZlmHK-qJbjlwBOlhRzGwvihsjMn4hayGpRBx0wfHGG8Sth_pwvMGJG24ht7-TiBhHluRwAD6FB3pFJsC2Z639raV-oZuPC9b3PojbiDqA",
    distance: "0.5 km",
    timeLeft: "Còn 3 giờ",
    isExpiring: false,
  },
  {
    id: "4",
    title: "Salad rau củ hữu cơ",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnZH6UjtotCUoc5crgyyfeVQhhkWR0gSM3thSZX1ilU5R4RS8CS_RLgoh2T5xW6UYkliQgQ4meJo_W-2SvEIG1GclMlZlaNkyHiA-0ZSVihSNzUNx92ND9UR8MiqeNedIpIbKcmXfAvyqa8m67-2vPufpqpluVy8iRD4XDiUHv_Iwi0zp8P6IVaRasBcDiJt5uwiipB19JCqW7j2dy2HeZaUNOyzz73OGIon-oSND7cb8nHaHrLy-3inhXsZGLHasYc4c8YXUXCw",
    posterName: "Healthy Garden",
    posterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxahoeugYbbZ3Hi1Sc-FUPqype0foLmWU5LhJGL35gJM7mJtl8WO7CmFD4dNxTtu9SKQumWjmWCrQqW_D12z32mhCGAF02AvLN9g4mdDVqtbvI6pD_K8okvNanx22onaD35WFRuTYj4v94uRYq9g8mp4xy_pGHAendpkK8q7aVQm4Mwjm0m_jbeE4zEYOX-xgVQSIYT0-w7IX_4U0HRa-qS0JR8q6ppUT7NV1CbDu_kg87wxa-MP2yS0HvJLq_SM9l3h5byeUM_w",
    distance: "2.0 km",
    timeLeft: "Còn 1 giờ",
    isExpiring: true,
  },
  {
    id: "5",
    title: "Bún chả Hà Nội",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbx6iD6Wdr9uQbHaiXPhGyGA-zP0W3CFSY08XJIFQWAd3i5r1kWhtdYYIZsDTl26S7KMf_U7A2S3vqrMJH-VeFD6xk-NkuyV33PKYwXW1gNvAp5BpCZlgZZQSVsho1jrR80b7-TsWnmgIrRKnschCdnpkl9288Cwxc9fpZ1P6hOkGO9tB6IEjPKiNMMpEQra7PR4HNt1CtEUJjVMbDZYL8co383ETY0Dl0sfSdizGtvccu4n-jjQS2Sn-evl2sFv6mkXYc5rRN1g",
    posterName: "Bún Chả Sinh Từ",
    posterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDTPYajNved7kbd_j8S8G_FW0QwqEDWdcj8mFGcJh13HIQ5CAreY9Ii9eHladz_okM1x8naU3Ks8oulMTYpjsKVFsDmPit8hSiyLb3_SqXAnSmfdU_DeX8UYfCgqHZuT6ZF0YVtFtG50zIEe7j6blPm-BSlsnI2WF3jJTNgGcrcfUDTe7yRB92Ah4r0uPxIyVp1n_balUr9LjCJuIO5mR5LTRllDWGvA3_5RSaFY8KH2K9h26KcbY5gjFXnIw4lGLhFdvmiqEEX0g",
    distance: "1.5 km",
    timeLeft: "Còn 4 giờ",
    isExpiring: false,
  },
  {
    id: "6",
    title: "Trái cây tươi gọt sẵn",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9bPLM2c5n07CaVyqsgCFfVqWqjZ8aZKrVyY3LzqPiGiP3dtU84nZisfcEZ3oM1_92mUnEZAg5SUJZWQ-wqlFeny_0iMEJAMdBvH3h63fV_adDLtMXE5dnFuaLuftViGiC_tigWrKzflD7-asXXaaetVV7fZkpL40hZsUBaNdaknJKlniZ7zAG1HikBtotYE6UmZrAwxvWiqygMOApGRc655SnA1Dqj-s5nld27mcxuvJgb_ckC82qmzD3T9xBn39ObNZc3Yx8zg",
    posterName: "Fruit Station",
    posterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkcE_ZnuE07x6Yw7eWeS5liaC602vxB7IaaW7s2cHiLLNWxJ_0BavUr5Z3nZDqF95CEjis3D_rYxEhE8WssoPN_T4jgXjaotkHB3CmFpVr5_egc29h4aH_Q2BPUM8yvNq5SL3VI7dhMrTDKXU-_DmSvRB1baepzyMY_JoJZA-jC3auzh98j_kUwV3g7v1V2BXeY15vsx-_g9MTDZhrSCCf3eRVZeBeg1LFkYMCjDfR983VWFHbV7UiiGuXwL6uvYUIZMMzuBGMCw",
    distance: "0.3 km",
    timeLeft: "Còn 30 phút",
    isExpiring: true,
  },
];

export default function FeedPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <FoodSearchBar />

      <div className="mt-8 mb-10">
        <FilterChipsMenu />
      </div>

      <h2 className="text-2xl font-bold mb-6">Món ăn gần bạn</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFoods.map((food) => (
          <FoodCard key={food.id} {...food} />
        ))}
      </div>
    </div>
  );
}
