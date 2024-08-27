import React, { useState } from "react";
import { Select, Typography, Row, Col, Avatar, Card } from "antd/lib";
import moment from "moment";

import { useGetCryptosQuery } from "../services/cryptoApi";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import Loader from "./Loader";
import Meta from "antd/es/card/Meta";

const demoImage =
  "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News";

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");
  const { data } = useGetCryptosQuery(100);
  const { data: cryptoNewsResponse } = useGetCryptoNewsQuery({
    newsCategory,
    count: simplified ? 6 : 12,
  });
  if (!cryptoNewsResponse?.success) return <Loader />;
  const cryptoNews = cryptoNewsResponse.data;
  return (
    <Row gutter={[16, 16]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {data?.data?.coins?.map((currency) => (
              <Option key={currency.id} value={currency.name}>
                {currency.name}
              </Option>
            ))}
          </Select>
        </Col>
      )}
      {cryptoNews.map((news, i) => (
        <Col xs={24} sm={12} md={8} lg={6} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Meta
                  className="news-title"
                  title={
                    news?.title.length > 100
                      ? `${news?.title.substring(0, 50)}...`
                      : news?.title
                  }
                />
                <img
                  src={news?.thumbnail || demoImage}
                  alt="news"
                  style={{ height: 50, width: 100 }}
                />
              </div>
              <div className="provider-container">
                <div>
                  <Avatar
                    src={news.source.favicon || demoImage}
                    alt={news.source.name}
                  />
                  <Text className="provider-name">{news.source?.name}</Text>
                </div>
                <Text>{moment(news.date).startOf("ss").fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
